#!/usr/bin/env tsx
/**
 * scripts/generate-post-images.ts
 *
 * Standalone batch pipeline that generates blog-header images for new/changed
 * MDX posts using Hugging Face's free Inference API (FLUX.1-schnell).
 *
 * Usage:
 *   npx tsx scripts/generate-post-images.ts                         # scan via git diff
 *   npx tsx scripts/generate-post-images.ts src/content/posts/foo.mdx src/content/posts/bar.mdx   # explicit files
 *
 * Environment:
 *   HF_TOKEN   required – your Hugging Face access token (Settings > Access Tokens)
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";
import { InferenceClient } from "@huggingface/inference";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL = "black-forest-labs/FLUX.1-schnell";
const POSTS_DIR = path.resolve("src/content/posts");
const OUTPUT_DIR = path.resolve("public/images/posts");
const FRONTMATTER_IMAGE_FIELD = "cover_image";

/** Delay between retry attempts (free-tier cold starts can take 10-15 s). */
const RETRY_DELAY_MS = 8_000;
const MAX_RETRIES = 3;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive a blog-post slug from an MDX file path. */
function slugFromFile(filePath: string): string {
  return path.basename(filePath, ".mdx");
}

/** Return absolute paths to every .mdx file in the posts directory. */
function getAllPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(POSTS_DIR, f));
}

/**
 * Determine which MDX files to process.
 *
 * Strategy (first-wins):
 *   1. CLI arguments → filter to .mdx files under src/content/posts/
 *   2. git diff HEAD~1 (requires at least 2 commits in history)
 *   3. Fallback: scan every post file (safe for first push / shallow clones)
 */
function resolveTargetFiles(): string[] {
  const cliArgs = process.argv.slice(2);

  // --- 1. Explicit CLI paths ------------------------------------------------
  if (cliArgs.length > 0) {
    return cliArgs
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => path.resolve(f))
      .filter((f) => f.startsWith(path.resolve("src/content/posts")));
  }

  // --- 2. Git diff against previous commit ----------------------------------
  try {
    const output = execSync("git diff --name-only HEAD~1", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const changed = output
      .split("\n")
      .filter(Boolean)
      .filter(
        (f) => f.startsWith("src/content/posts/") && f.endsWith(".mdx"),
      )
      .map((f) => path.resolve(f));

    if (changed.length > 0) {
      console.log(`ℹ️  Found ${changed.length} changed post(s) via git diff.`);
      return changed;
    }
  } catch {
    // HEAD~1 doesn't exist (first commit) or git isn't available
  }

  // --- 3. Fallback: scan all posts ------------------------------------------
  const all = getAllPostFiles();
  console.log(
    `ℹ️  Git diff unavailable — scanning all ${all.length} post(s).`,
  );
  return all;
}

/**
 * Map a category slug / label to an abstract visual concept.
 *
 * We never quote the post title — FLUX.1-schnell interprets literal title
 * text as a poster/headline rendering instruction, producing garbled fake
 * text. Instead, we describe the visual theme conceptually.
 */
const CATEGORY_VISUALS: Record<string, string> = {
  ai: "abstract neural network nodes, glowing connected data points, artificial intelligence concepts, futuristic digital landscape",
  "data analytics": "flowing data streams, database schemas, abstract charts, connected information nodes, clean technical diagrams",
  data: "flowing data streams, database schemas, abstract charts, connected information nodes, clean technical diagrams",
  engineering: "interlocking gears and system architecture diagrams, pipeline flows, abstract infrastructure, clean blueprint-style visuals",
  analytics: "abstract graphs and charts, upward-trending lines, data visualization elements, analytical dashboard motifs",
  career: "abstract pathways and growth arrows, interconnected people nodes, professional development symbols, clean minimalist workspace elements",
  tech: "abstract circuit patterns, geometric tech motifs, interconnected devices, clean futuristic interface elements",
  coding: "abstract code symbols, syntax-highlighted lines, terminal window motifs, clean developer workspace elements",
  tutorials: "abstract step indicators, numbered pathway nodes, knowledge flow diagrams, clean educational layout elements",
  security: "abstract shield patterns, encrypted data flows, secure network nodes, layered defense visual metaphors",
  compliance: "interconnected rule structures, layered governance frameworks, abstract regulatory pathways, clean organizational motifs",
  productivity: "abstract workflow diagrams, connected task nodes, efficiency symbols, clean organized system visuals",
  tools: "collection of abstract tool icons, interconnected utility nodes, clean organized toolkit visual, minimalist tech workspace",
  strategy: "abstract roadmap pathways, interconnected planning nodes, directional flow motifs, clean strategic diagram elements",
  business: "abstract growth charts, interconnected market nodes, clean professional diagrams, organizational flow visuals",
  design: "abstract creative elements, color palette flows, geometric design motifs, minimal aesthetic composition, clean visual hierarchy",
  development: "abstract code flow patterns, interconnected system nodes, clean architectural diagrams, minimalist dev-environment motifs",
};

/** Default visual description for uncategorised / generic posts. */
const DEFAULT_VISUAL =
  "abstract geometric shapes, interconnected nodes, clean minimalist tech motifs, professional digital landscape";

/**
 * Build a purely visual description prompt for FLUX.1-schnell.
 *
 * NEVER include the literal title — FLUX treats it as headline rendering
 * instructions, producing garbled text. Instead we build a conceptual prompt
 * from the post's category (for theme) and excerpt (for keywords).
 */
function buildPrompt(
  categories: string[],
  excerpt: string,
): string {
  // Pick the best category visual
  const categoryKey = categories
    .map((c) => c.trim().toLowerCase())
    .find((c) => CATEGORY_VISUALS[c]) ?? "default";
  const baseVisual =
    categoryKey === "default"
      ? DEFAULT_VISUAL
      : CATEGORY_VISUALS[categoryKey];

  // Extract a few conceptual keywords from the excerpt (skip numbers, short words)
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "this", "that",
    "these", "those", "it", "its", "you", "your", "we", "our", "they",
    "them", "their", "what", "which", "who", "whom", "how", "when",
    "where", "why", "not", "no", "nor", "so", "if", "then", "than",
    "too", "very", "just", "about", "also", "more", "some", "any",
    "every", "each", "all", "both", "few", "most", "many", "much",
    "into", "over", "such", "only", "own", "same", "as", "but", "up",
    "out", "off", "down", "new", "need", "know",
  ]);

  // Filter out number-heavy / short words for the conceptual keywords
  const keywords = (excerpt ?? "")
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length >= 4 &&
        !/^\d+$/.test(w) &&
        !stopWords.has(w.toLowerCase()),
    )
    .slice(0, 5);

  const context =
    keywords.length > 0
      ? `featuring ${keywords.join(", ").toLowerCase()}`
      : "featuring connected elements and modern tech motifs";

  return [
    `A clean, modern illustration, ${baseVisual}, ${context}.`,
    "Style: minimal, flat vector art, muted gradients, professional blog appearance.",
    "Do not include any text, words, letters, numbers, or typography in the image — illustration only, no writing of any kind.",
  ].join(" ");
}

/** Ensure the output directory exists. */
function ensureOutputDir(): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Read the MDX file, return its parsed frontmatter + raw string.
 * Returns `null` on parse failure.
 */
function readPost(
  filePath: string,
): { data: Record<string, unknown>; content: string; raw: string } | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { data, content, raw };
  } catch (err) {
    console.error(`  ✗ Failed to parse frontmatter: ${err}`);
    return null;
  }
}

/**
 * Check whether the post already has a cover image set.
 */
function hasCoverImage(data: Record<string, unknown>): boolean {
  const val = data[FRONTMATTER_IMAGE_FIELD];
  return typeof val === "string" && val.trim().length > 0;
}

/**
 * Call Hugging Face Inference API (FLUX.1-schnell) to generate an image.
 * Returns a Buffer with the PNG data, or null on failure.
 *
 * Retries up to MAX_RETRIES times with a delay — the free Inference API
 * queues requests on shared GPUs, so first attempts often time out.
 */
async function generateImage(
  client: InferenceClient,
  categories: string[],
  excerpt: string,
): Promise<Buffer | null> {
  const prompt = buildPrompt(categories, excerpt);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const blob = await client.textToImage(
        {
          provider: "nscale",
          model: MODEL,
          inputs: prompt,
          parameters: { num_inference_steps: 8 },
        },
        { outputType: "blob" },
      );

      const buffer = Buffer.from(await blob.arrayBuffer());
      if (buffer.length === 0) {
        console.warn(`  ⚠  Empty image returned (attempt ${attempt}).`);
      } else {
        return buffer;
      }
    } catch (err) {
      const isLast = attempt === MAX_RETRIES;
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠  HF API error (attempt ${attempt}/${MAX_RETRIES}): ${message}`);

      if (!isLast) {
        console.log(`     Retrying in ${RETRY_DELAY_MS / 1000}s…`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  return null;
}

/**
 * Write the image buffer to `public/images/posts/{slug}.png`.
 * Returns the relative URL path (e.g. "/images/posts/my-post.png").
 */
function saveImage(slug: string, buffer: Buffer): string {
  const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
  fs.writeFileSync(outPath, buffer);
  return `/images/posts/${slug}.png`;
}

/**
 * Update the MDX file's frontmatter to include the image path.
 */
function updateFrontmatter(
  filePath: string,
  content: string,
  imageUrl: string,
): void {
  const { data, content: body } = matter(content);
  data[FRONTMATTER_IMAGE_FIELD] = imageUrl;

  // Reconstruct with updated frontmatter
  const updated = matter.stringify(body, data as Record<string, unknown>);

  // Keep trailing newline if the original had one
  const trailing = content.endsWith("\n") ? "\n" : "";
  fs.writeFileSync(filePath, updated.trimEnd() + trailing, "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    console.error(
      "❌ HF_TOKEN environment variable is not set.\n" +
        "   Get a free token at https://huggingface.co/settings/tokens\n" +
        "   Then set it: $env:HF_TOKEN='your_token_here'",
    );
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log("  Blog Post Image Generator");
  console.log("  Model: black-forest-labs/FLUX.1-schnell (via Hugging Face)");
  console.log("=".repeat(60));

  // --- Resolve which posts to process ---------------------------------------
  const targetFiles = resolveTargetFiles();

  if (targetFiles.length === 0) {
    console.log("\n✅ No MDX files to process.");
    return;
  }

  console.log(`\n📂 Target files (${targetFiles.length}):`);
  for (const f of targetFiles) {
    console.log(`   • ${path.relative(process.cwd(), f)}`);
  }

  // --- Filter out posts that already have a cover image ---------------------
  const toProcess: { filePath: string; slug: string }[] = [];

  for (const filePath of targetFiles) {
    const slug = slugFromFile(filePath);
    const post = readPost(filePath);

    if (!post) {
      console.log(`  ⏭  ${slug} — skipped (parse error)`);
      continue;
    }

    if (hasCoverImage(post.data)) {
      console.log(`  ⏭  ${slug} — already has ${FRONTMATTER_IMAGE_FIELD}`);
      continue;
    }

    toProcess.push({ filePath, slug });
  }

  if (toProcess.length === 0) {
    console.log("\n✅ All target posts already have cover images. Nothing to do.");
    return;
  }

  console.log(
    `\n🎯 Posts needing images (${toProcess.length}): ${toProcess.map((p) => p.slug).join(", ")}`,
  );

  // --- Initialize Hugging Face client ---------------------------------------
  console.log("\n🔑 Initializing Hugging Face Inference client…");
  const client = new InferenceClient(apiKey);
  ensureOutputDir();

  // --- Process each post ----------------------------------------------------
  const succeeded: string[] = [];
  const failed: { slug: string; reason: string }[] = [];

  for (const { filePath, slug } of toProcess) {
    const post = readPost(filePath);
    if (!post) {
      failed.push({ slug, reason: "Frontmatter parse error" });
      continue;
    }

    const title = String(post.data.title ?? slug);
    const categories = (
      Array.isArray(post.data.categories) ? post.data.categories : []
    ) as string[];
    const excerpt = String(post.data.excerpt ?? post.data.description ?? "");

    console.log(`\n🖼  Generating image for: ${title}`);
    console.log(`   Category: ${categories.join(", ") || "(none)"}`);
    console.log(`   Visual concept from excerpt: ${excerpt.slice(0, 100)}…`);

    const imageBuffer = await generateImage(client, categories, excerpt);

    if (!imageBuffer) {
      console.error(`  ✗ Failed to generate image for "${title}" after ${MAX_RETRIES} attempts`);
      failed.push({ slug, reason: "HF API returned no image after retries" });
      continue;
    }

    try {
      const imageUrl = saveImage(slug, imageBuffer);
      console.log(`   ✅ Image saved → public${imageUrl} (${formatBytes(imageBuffer.length)})`);

      updateFrontmatter(filePath, post.raw, imageUrl);
      console.log(`   ✅ Frontmatter updated: ${FRONTMATTER_IMAGE_FIELD}: "${imageUrl}"`);

      succeeded.push(slug);
    } catch (err) {
      console.error(`  ✗ Failed to save/update for "${title}": ${err}`);
      failed.push({ slug, reason: String(err) });
    }
  }

  // --- Summary --------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("  Summary");
  console.log("=".repeat(60));

  if (succeeded.length > 0) {
    console.log(`\n✅ Generated images for:`);
    for (const slug of succeeded) {
      console.log(`   • ${slug}`);
    }
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed posts:`);
    for (const { slug, reason } of failed) {
      console.log(`   • ${slug} — ${reason}`);
    }
    // Exit with non-zero so CI can detect failures
    process.exitCode = 1;
  }

  console.log("\nDone.");
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
  process.exit(1);
});
