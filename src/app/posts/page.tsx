"use client"

import { ScrollReveal } from "@/components/effects/ScrollReveal"

const articles = [
  {
    title: "25 Essential AI Tools Every Professional Should Know in 2026",
    slug: "25-ai-tools-2026",
    category: "AI",
    readTime: 18,
    date: "November 30, 2025",
    excerpt: "Discover the most transformative AI tools every professional needs to know in 2026, from productivity boosters to strategic decision-making platforms."
  },
  {
    title: "Break Into Data Analytics in 2026: Your Complete Guide",
    slug: "break-into-data-analytics-2026",
    category: "Data Analytics",
    readTime: 20,
    date: "December 20, 2025",
    excerpt: "A comprehensive roadmap for transitioning into data analytics, covering essential skills, tools, portfolio projects, and job market insights for 2026."
  },
  {
    title: "Resume Red Flags That Scare Tech Employers",
    slug: "resume-red-flags-tech-career",
    category: "Career",
    readTime: 15,
    date: "January 15, 2026",
    excerpt: "Learn to identify and fix common resume mistakes that make tech employers skip your application, with specific examples from real hiring data."
  },
];

export default function ArticlesPage() {
  return (
    <div className="max-w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Articles</span>
        </nav>

        <ScrollReveal>
          <h1 className="text-4xl font-bold mb-2">All Articles</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Guides written by practitioners, not theorists.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={`/posts/${article.slug}`}
              className="article-card"
            >
              <div className="article-meta">
                <span className="article-category">{article.category}</span>
                <span className="article-stats">
                  {article.date} · {article.readTime} min read
                </span>
              </div>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-desc">{article.excerpt}</p>
            </a>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              New guides are landing soon. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
