import fs from "fs";
import path from "path";

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
