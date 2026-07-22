import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { getAllPosts, formatPostDate } from "@/lib/posts";

export default function ArticlesPage() {
  const articles = getAllPosts();

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
                <span className="article-category">{article.categories[0]}</span>
                <span className="article-stats">
                  {formatPostDate(article.date)} · {article.reading_time} min read
                </span>
              </div>
              {article.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
              )}
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
