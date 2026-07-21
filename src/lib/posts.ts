import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags?: string[];
  author: string;
  reading_time: number;
  excerpt: string;
  source_url?: string;
}

const postsDirectory = path.join(process.cwd(), "src/content/posts");

/** Return all slug strings derived from MDX filenames. */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Return raw MDX source for a given slug (read from disk). */
export function getPostBySlug(slug: string): string | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

/** Return just the parsed frontmatter (+ slug) for a post, or null if missing/broken. */
export function getPostMeta(slug: string): PostMeta | null {
  const raw = getPostBySlug(slug);
  if (!raw) return null;
  try {
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author ?? "InsightNerd",
      reading_time: typeof data.reading_time === "number" ? data.reading_time : 5,
      excerpt: data.excerpt ?? "",
      source_url: data.source_url ?? undefined,
    };
  } catch {
    // Malformed frontmatter shouldn't crash the whole site build
    return null;
  }
}

/** All posts, parsed, newest first. */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostMeta(slug))
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Posts whose `categories` frontmatter includes the given category (case-insensitive). */
export function getPostsByCategory(category: string): PostMeta[] {
  const normalized = category.trim().toLowerCase();
  return getAllPosts().filter((p) =>
    p.categories.some((c) => c.trim().toLowerCase() === normalized)
  );
}

/** Human-friendly date, e.g. "November 30, 2025" — matches the hardcoded format the site used before. */
export function formatPostDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
