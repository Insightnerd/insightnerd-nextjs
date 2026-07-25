"use client"

import { useState, useMemo } from "react";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Search } from "lucide-react";
import { formatPostDate } from "@/lib/posts-shared";
import type { PostMeta } from "@/lib/posts-shared";

const PER_PAGE = 10;

interface ArticlesListProps {
  articles: PostMeta[];
}

export function ArticlesList({ articles }: ArticlesListProps) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PER_PAGE);

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [articles, query]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PER_PAGE);
          }}
          className="w-full rounded-lg border border-border bg-muted pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
      </div>

      <div className="flex flex-col gap-5">
        {shown.map((article, i) => (
          <ScrollReveal key={article.slug} delay={i % PER_PAGE}>
            <a
              href={`/posts/${article.slug}`}
              className="article-card"
            >
              <div className="article-meta">
                <span className="article-category">{article.categories[0]}</span>
                <span className="article-stats">
                  {formatPostDate(article.date)} · {article.reading_time} min read
                </span>
              </div>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-desc">{article.excerpt}</p>
            </a>
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            {query ? `No results for "${query}". Try a different search.` : "New guides are landing soon. Check back later!"}
          </p>
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisible((v) => v + PER_PAGE)}
            className="rounded-lg border border-border bg-muted px-6 py-2.5 text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Load More ({filtered.length - visible} remaining)
          </button>
        </div>
      )}

      {!query && filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Showing {shown.length} of {filtered.length} articles
        </p>
      )}
    </>
  );
}
