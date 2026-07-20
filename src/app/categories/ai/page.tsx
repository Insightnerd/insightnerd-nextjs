export default function AICategoryPage() {
  return (
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-foreground">AI</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">AI Articles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our collection of AI and machine learning guides written by practitioners
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
  );
}

const articles = [
  {
    title: "Building Scalable Backend Systems with Node.js",
    slug: "building-scalable-backend-systems-with-nodejs",
    readTime: 12,
    date: "July 20, 2026",
    category: "Coding",
    excerpt: "Learn how to build scalable backend systems using Node.js and best practices for handling high-traffic applications."
  },
  {
    title: "AI Agents: Practical Implementation Guide",
    slug: "ai-agents-practical-implementation-guide",
    readTime: 15,
    date: "July 18, 2026",
    category: "AI",
    excerpt: "A comprehensive guide to implementing AI agents, from basic concepts to advanced deployment strategies in production environments."
  },
  {
    title: "Data Pipeline Architecture for Analytics",
    slug: "data-pipeline-architecture-for-analytics",
    readTime: 10,
    date: "July 15, 2026",
    category: "Data",
    excerpt: "Design and implement robust data pipelines that can handle large volumes of data while maintaining performance and reliability."
  },
];
