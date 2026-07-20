import { CategoryPageAnimations } from "@/components/CategoryPageAnimations";

export default function DataAnalyticsCategoryPage() {
  return (
    <CategoryPageAnimations>
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-foreground">Data Analytics</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Data Analytics Articles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our collection of data analysis guides and analytics techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article key={article.slug} className="group">
              <div className="card h-full">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        <a href={`/posts/${article.slug}`}>{article.title}</a>
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{article.readTime} min read</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {article.category}
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              New guides are landing soon in this topic. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
    </CategoryPageAnimations>
  );
}

const articles = [
  {
    title: "Break Into Data Analytics in 2026: Your Complete Guide",
    slug: "break-into-data-analytics-2026",
    readTime: 20,
    date: "December 20, 2025",
    category: "Data Analytics",
    excerpt: "A comprehensive roadmap for transitioning into data analytics, covering essential skills, tools, portfolio projects, and job market insights for 2026."
  },
];
