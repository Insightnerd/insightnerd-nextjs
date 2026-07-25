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
  cover_image?: string;
}

export function formatPostDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
