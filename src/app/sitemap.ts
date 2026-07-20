import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getPostSlugs } from "@/lib/posts";

const BASE_URL = "https://www.insightnerd.in";
const postsDirectory = path.join(process.cwd(), "src/content/posts");

const categories = [
  { slug: "ai", name: "AI" },
  { slug: "coding", name: "Coding" },
  { slug: "data-analytics", name: "Data Analytics" },
  { slug: "tutorials", name: "Tutorials" },
  { slug: "career", name: "Career" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Category pages — driven from the same set used in Navigation
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Post pages — programmatically generated from MDX files on disk
  const slugs = getPostSlugs();
  const postPages: MetadataRoute.Sitemap = slugs.map((slug) => {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    let lastModified: Date;
    try {
      lastModified = fs.statSync(filePath).mtime;
    } catch {
      lastModified = new Date();
    }
    return {
      url: `${BASE_URL}/posts/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [...staticPages, ...categoryPages, ...postPages];
}
