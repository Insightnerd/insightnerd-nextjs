#!/usr/bin/env python3
"""
InsightNerd daily content agent.

Pipeline: search web (Tavily) -> dedupe -> summarize/clean (LLM)
         -> categorize into site taxonomy -> write .mdx -> update manifest.

Run manually:  python scripts/fetch_and_publish.py
Env vars required: TAVILY_API_KEY, plus one of:
  - nothing else                  (LLM_BACKEND=ollama, default, free, local)
  - OPENROUTER_API_KEY            (LLM_BACKEND=openrouter, free-tier or cheap, cloud)
  - ANTHROPIC_API_KEY             (LLM_BACKEND=anthropic, paid, best quality)
"""

import os
import re
import json
import time
import base64
import hashlib
import datetime
from pathlib import Path

import requests
import yaml
from rapidfuzz import fuzz

# ---------------------------------------------------------------------------
# CONFIG — edit this section to change what gets fetched and where it lands.
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "src" / "content" / "posts"
IMAGES_DIR = REPO_ROOT / "public" / "images" / "posts"
MANIFEST_PATH = REPO_ROOT / "src" / "content" / ".manifest.json"

# --- LLM backend switch -----------------------------------------------------
# "ollama"     -> FREE, runs locally on whichever laptop runs the script. No key needed.
#                 Good for early testing on either your or Vishal's machine.
# "openrouter" -> FREE (rate-limited, ~20 req/min & 200/day) or cheap paid models, cloud-hosted.
#                 Works from GitHub Actions too, since it doesn't need a local model running.
# "anthropic"  -> PAID, highest quality writing. Flip to this once ready for real launch.
LLM_BACKEND = os.environ.get("LLM_BACKEND", "openrouter")

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.1")  # pull with: ollama pull llama3.1

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
# Free model IDs on OpenRouter rotate over time — verify at https://openrouter.ai/models
# (filter: prompt price = 0) before relying on this long-term. Stable as of July 2026.
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
CLAUDE_MODEL = "claude-sonnet-5"

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
# --- Cover image generation --------------------------------------------------
# Toggle this off any time with GENERATE_IMAGES=false — the rest of the pipeline
# works fine without it.
GENERATE_IMAGES = os.environ.get("GENERATE_IMAGES", "true").lower() == "true"

# "huggingface" -> FREE (rate-limited/queued), runs on HF's hosted GPUs, no key cost.
#                  Uses FLUX.1-schnell by default — Apache 2.0 licensed, safe for a
#                  commercial site. (FLUX.1-dev / FLUX.2-dev are non-commercial-only
#                  licenses — don't use those for a monetized site without checking.)
# "openrouter"  -> PAID, billed per image (a few cents each), faster/more reliable,
#                  more model choice (Gemini "Nano Banana", GPT Image, etc).
IMAGE_BACKEND = os.environ.get("IMAGE_BACKEND", "huggingface")

HF_TOKEN = os.environ.get("HF_TOKEN")
HF_IMAGE_MODEL = os.environ.get("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell")

IMAGE_MODEL = os.environ.get("IMAGE_MODEL", "google/gemini-2.5-flash-image")  # OpenRouter only
IMAGE_ASPECT_RATIO = os.environ.get("IMAGE_ASPECT_RATIO", "16:9")  # good for blog cover images
IMAGE_RESOLUTION = os.environ.get("IMAGE_RESOLUTION", "1K")  # 512 / 1K / 2K / 4K — OpenRouter only

MAX_ITEMS_PER_CATEGORY_PER_RUN = 1  # start conservative; raise once you trust output
MIN_RELEVANCE_SCORE = 0.30  # Tavily relevance score threshold (0-1)
TITLE_DUP_THRESHOLD = 88  # rapidfuzz similarity score (0-100) above which we treat as duplicate
SEARCH_RECENCY_DAYS = 3  # only consider results published within this many days (news mode)
RESULTS_PER_QUERY = 8  # pull more candidates per query so there's runway before duplicates exhaust it

# Site categories -> search queries. `tags` map to your finer taxonomy
# (Applications / Data Quality / AI Analytics / Data Engineering) even though
# the live site only has 5 top-level categories today. Edit freely.
# NOTE: every category has multiple queries on purpose — a single evergreen query
# returns nearly the same top results every day, so once those are published once,
# every future run finds "nothing new" and correctly skips them. More queries =
# more runway before you need to add fresh ones.
TAXONOMY = {
    "AI": {
        "topic": "news",
        "queries": [
            ("LLM Ops production news", ["AI Analytics", "LLM Ops"]),
            ("RAG fine tuning techniques news", ["AI Analytics", "RAG Tuning"]),
            ("AI agent tooling news", ["Applications", "Automation"]),
            ("machine learning model release news", ["AI Analytics"]),
            ("AI startup funding news", ["Applications"]),
        ],
    },
    "Data Analytics": {
        "topic": "news",
        "queries": [
            ("data observability tools news", ["Data Quality", "Observability"]),
            ("data governance PII masking news", ["Data Quality", "Governance"]),
            ("data pipeline ingestion CDC news", ["Data Engineering", "Ingestion"]),
            ("DBT pipelines news", ["Data Engineering", "Transformation"]),
            ("data engineering tools news", ["Data Engineering"]),
            ("business intelligence analytics news", ["Data Quality"]),
        ],
    },
    "Coding": {
        "topic": "news",
        "queries": [
            ("software engineering best practices news", ["Applications", "Dashboards"]),
            ("programming language release news", ["Applications"]),
            ("developer tools news", ["Applications"]),
        ],
    },
    "Career": {
        "topic": "news",
        "queries": [
            ("tech hiring trends data analyst news", []),
            ("data analyst job market news", []),
            ("tech layoffs hiring news", []),
        ],
    },
    "Tutorials": {
        # Evergreen how-to content isn't "news" — a 3-day recency window would starve
        # this category. Use general search instead; rely on query variety + dedupe
        # to keep finding different guides over time.
        "topic": "general",
        "queries": [
            ("data engineering tool tutorial guide", []),
            ("Python SQL tutorial guide", []),
            ("AI tool how-to guide", []),
        ],
    },
}

AUTHOR_NAME = "InsightNerd Team"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def slugify(title: str) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s[:80].strip("-")


def load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        return json.loads(MANIFEST_PATH.read_text())
    return {"published": []}  # list of {"url_hash": ..., "title": ..., "category": ...}


def save_manifest(manifest: dict) -> None:
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))


def url_hash(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def is_duplicate(manifest: dict, url: str, title: str, category: str) -> bool:
    h = url_hash(url)
    for item in manifest["published"]:
        if item["url_hash"] == h:
            return True
        if item["category"] == category and fuzz.token_sort_ratio(item["title"], title) >= TITLE_DUP_THRESHOLD:
            return True
    return False


def tavily_search(query: str, topic: str = "news", max_results: int = RESULTS_PER_QUERY) -> list[dict]:
    if not TAVILY_API_KEY:
        raise RuntimeError("TAVILY_API_KEY not set")
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "topic": topic,
        "max_results": max_results,
        "include_answer": False,
    }
    if topic == "news":
        payload["days"] = SEARCH_RECENCY_DAYS  # only valid/meaningful in news mode
    resp = requests.post("https://api.tavily.com/search", json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get("results", [])


# ---------------------------------------------------------------------------
# LLM backends — all three implement the same contract:
# take (system_prompt, user_prompt), return raw text the model produced.
# ---------------------------------------------------------------------------


def _build_prompts(raw_title: str, raw_content: str, source_url: str, category: str) -> tuple[str, str]:
    system_prompt = f"""You are the content engine for InsightNerd (insightnerd.in), a technical
data/AI site written by practitioners for practitioners. You will be given a raw web article.

Your job: write an ORIGINAL long-form article (900-1400 words) inspired by the facts in the
source, in your own words. Never copy sentences verbatim. Structure it with a few H2/H3
sections in Markdown. Tone: direct, practical, no fluff, no marketing speak.

The article MUST belong to this exact site category: "{category}"
(valid categories are only: AI, Data Analytics, Coding, Career, Tutorials — do not invent new ones)

Return ONLY valid JSON, no markdown fences, no preamble, with this exact shape:
{{
  "title": "string, punchy, under 70 chars",
  "excerpt": "string, 1-2 sentences, under 200 chars",
  "body_markdown": "string, the full article body in markdown, starting with an H1",
  "reading_time": integer minutes
}}"""
    user_prompt = f"SOURCE TITLE: {raw_title}\nSOURCE URL: {source_url}\n\nSOURCE CONTENT:\n{raw_content[:6000]}"
    return system_prompt, user_prompt


def _extract_json(raw_text: str) -> dict | None:
    raw_text = raw_text.strip()
    raw_text = re.sub(r"^```json\s*|^```\s*|\s*```$", "", raw_text)
    # Some models add chatty text around the JSON — grab the outermost {...} block.
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if match:
        raw_text = match.group(0)
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return None


def _call_ollama(system_prompt: str, user_prompt: str) -> str:
    resp = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
            "options": {"temperature": 0.4},
        },
        timeout=180,
    )
    resp.raise_for_status()
    return resp.json()["message"]["content"]


def _call_openrouter(system_prompt: str, user_prompt: str) -> str:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set (required when LLM_BACKEND=openrouter)")
    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            # Optional but recommended by OpenRouter for their own analytics/rate-limit fairness:
            "HTTP-Referer": "https://www.insightnerd.in",
            "X-Title": "InsightNerd Content Agent",
        },
        json={
            "model": OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.4,
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"]


def _call_anthropic(system_prompt: str, user_prompt: str) -> str:
    if not ANTHROPIC_API_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY not set (required when LLM_BACKEND=anthropic)")
    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": CLAUDE_MODEL,
            "max_tokens": 4000,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    return "".join(b["text"] for b in data.get("content", []) if b.get("type") == "text")


def clean_and_write(raw_title: str, raw_content: str, source_url: str, category: str, tags: list[str]) -> dict | None:
    """Runs the configured LLM backend to produce a cleaned, original article as strict JSON."""
    system_prompt, user_prompt = _build_prompts(raw_title, raw_content, source_url, category)

    if LLM_BACKEND == "ollama":
        raw_text = _call_ollama(system_prompt, user_prompt)
    elif LLM_BACKEND == "openrouter":
        raw_text = _call_openrouter(system_prompt, user_prompt)
    elif LLM_BACKEND == "anthropic":
        raw_text = _call_anthropic(system_prompt, user_prompt)
    else:
        raise ValueError(f"Unknown LLM_BACKEND: {LLM_BACKEND}")

    parsed = _extract_json(raw_text)
    if parsed is None:
        print(f"  ! {LLM_BACKEND} did not return valid JSON for '{raw_title}', skipping")
        return None

    parsed["tags"] = tags
    return parsed


def unique_slug(title: str) -> str:
    """Compute a filesystem-safe slug, appending -2, -3, ... if the .mdx already exists.
    Used for both the post filename and the cover image filename, so they match."""
    base = slugify(title)
    candidate = base
    counter = 2
    while (POSTS_DIR / f"{candidate}.mdx").exists():
        candidate = f"{base}-{counter}"
        counter += 1
    return candidate


def _build_image_prompt(title: str, excerpt: str, category: str) -> str:
    return (
        f"A clean, modern editorial illustration for a technical blog article titled "
        f"'{title}'. Context: {excerpt}. Category: {category}. Style: minimal, professional, "
        f"tech-blog cover image, no text or words in the image, no logos, no watermarks, "
        f"flat design or subtle 3D, suitable as a header banner."
    )


def _generate_image_huggingface(prompt: str) -> tuple[bytes, str]:
    """Calls HF's free-tier hosted Inference API. Returns (raw_image_bytes, media_type)."""
    if not HF_TOKEN:
        raise RuntimeError("HF_TOKEN not set (required when IMAGE_BACKEND=huggingface)")
    resp = requests.post(
        f"https://api-inference.huggingface.co/models/{HF_IMAGE_MODEL}",
        headers={"Authorization": f"Bearer {HF_TOKEN}"},
        json={"inputs": prompt},
        timeout=180,
    )
    resp.raise_for_status()
    content_type = resp.headers.get("content-type", "image/jpeg")
    if "json" in content_type:
        # Free-tier Spaces sometimes return a JSON "model is loading, retry" response
        # instead of an image while the model cold-starts.
        raise RuntimeError(f"HF returned JSON instead of an image (likely cold-start/queue): {resp.text[:200]}")
    return resp.content, content_type


def _generate_image_openrouter(prompt: str) -> tuple[bytes, str]:
    """Calls OpenRouter's paid Image API. Returns (raw_image_bytes, media_type)."""
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set (required when IMAGE_BACKEND=openrouter)")
    resp = requests.post(
        "https://openrouter.ai/api/v1/images",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": IMAGE_MODEL,
            "prompt": prompt,
            "aspect_ratio": IMAGE_ASPECT_RATIO,
            "resolution": IMAGE_RESOLUTION,
            "output_format": "png",
        },
        timeout=120,
    )
    resp.raise_for_status()
    result = resp.json()
    image_entry = result["data"][0]
    image_bytes = base64.b64decode(image_entry["b64_json"])
    media_type = image_entry.get("media_type", "image/png")
    cost = result.get("usage", {}).get("cost")
    if cost is not None:
        print(f"    (OpenRouter image cost: ${cost:.4f})")
    return image_bytes, media_type


def generate_cover_image(title: str, excerpt: str, category: str, slug: str) -> str | None:
    """Generates a cover image and saves it under public/images/posts/.
    Returns the site-relative path (e.g. "/images/posts/my-slug.png") or None on any
    failure — image generation is never allowed to block publishing the article itself."""
    if not GENERATE_IMAGES:
        return None

    prompt = _build_image_prompt(title, excerpt, category)

    try:
        if IMAGE_BACKEND == "huggingface":
            image_bytes, media_type = _generate_image_huggingface(prompt)
        elif IMAGE_BACKEND == "openrouter":
            image_bytes, media_type = _generate_image_openrouter(prompt)
        else:
            raise ValueError(f"Unknown IMAGE_BACKEND: {IMAGE_BACKEND}")

        ext = {"image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp"}.get(
            media_type.split(";")[0].strip(), "jpg"
        )
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        filepath = IMAGES_DIR / f"{slug}.{ext}"
        filepath.write_bytes(image_bytes)
        print(f"  + generated cover image ({IMAGE_BACKEND}): {filepath.relative_to(REPO_ROOT)}")
        return f"/images/posts/{slug}.{ext}"
    except Exception as e:
        print(f"  ! image generation failed ({IMAGE_BACKEND}), publishing without a cover image: {e}")
        return None


def write_mdx(parsed: dict, category: str, source_url: str, slug: str, cover_image: str | None = None) -> Path:
    filepath = POSTS_DIR / f"{slug}.mdx"

    now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    frontmatter = {
        "title": parsed["title"],
        "date": now,
        "categories": [category],
        "tags": parsed.get("tags", []),
        "author": AUTHOR_NAME,
        "reading_time": parsed.get("reading_time", 6),
        "excerpt": parsed["excerpt"],
        "source_url": source_url,
    }
    if cover_image:
        frontmatter["cover_image"] = cover_image

    fm_yaml = yaml.safe_dump(frontmatter, sort_keys=False, allow_unicode=True).strip()
    content = f"---\n{fm_yaml}\n---\n\n{parsed['body_markdown']}\n"

    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    filepath.write_text(content, encoding="utf-8")
    return filepath


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print(f"LLM backend: {LLM_BACKEND}")
    manifest = load_manifest()
    written = []

    total_queries = 0
    failed_queries = 0
    total_candidates = 0  # results returned by search, before dedup/relevance filtering

    for category, cfg in TAXONOMY.items():
        count_this_category = 0
        topic = cfg.get("topic", "news")
        for query, tags in cfg["queries"]:
            if count_this_category >= MAX_ITEMS_PER_CATEGORY_PER_RUN:
                break
            total_queries += 1
            print(f"[{category}] searching ({topic}): {query}")
            try:
                results = tavily_search(query, topic=topic)
            except Exception as e:
                print(f"  ! search failed: {e}")
                failed_queries += 1
                continue

            total_candidates += len(results)

            for r in results:
                if count_this_category >= MAX_ITEMS_PER_CATEGORY_PER_RUN:
                    break
                title = r.get("title", "").strip()
                url = r.get("url", "").strip()
                content = r.get("content", "") or r.get("raw_content", "")
                score = r.get("score", 1.0)

                if not title or not url or not content:
                    continue
                if score < MIN_RELEVANCE_SCORE:
                    continue
                if is_duplicate(manifest, url, title, category):
                    print(f"  - skip (dup): {title}")
                    continue

                print(f"  + processing: {title}")
                try:
                    parsed = clean_and_write(title, content, url, category, tags)
                except Exception as e:
                    print(f"  ! LLM call failed: {e}")
                    continue
                if parsed is None:
                    continue

                slug = unique_slug(parsed["title"])
                cover_image = generate_cover_image(parsed["title"], parsed["excerpt"], category, slug)
                filepath = write_mdx(parsed, category, url, slug, cover_image)
                manifest["published"].append(
                    {"url_hash": url_hash(url), "title": parsed["title"], "category": category, "url": url}
                )
                written.append(str(filepath.relative_to(REPO_ROOT)))
                count_this_category += 1
                time.sleep(1)  # be polite to the API

    save_manifest(manifest)

    print(f"\nDone. Wrote {len(written)} new post(s):")
    for w in written:
        print(f"  - {w}")
    print(f"\nQueries run: {total_queries}, failed: {failed_queries}, candidates seen: {total_candidates}")

    # Write a summary file GitHub Actions can use in the PR body
    summary_path = REPO_ROOT / "scripts" / "_last_run_summary.txt"
    summary_path.write_text("\n".join(written) if written else "No new posts this run.")

    # Distinguish "genuinely broken" from "just nothing new today":
    # if every single query failed outright (bad key, network, Tavily down), that's
    # a real problem worth failing the CI job over. If queries succeeded but every
    # candidate was a duplicate or below the relevance bar, that's a normal quiet day.
    if total_queries > 0 and failed_queries == total_queries:
        print("\n::error::Every search query failed — check TAVILY_API_KEY and network access.")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
