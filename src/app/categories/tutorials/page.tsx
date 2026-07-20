export default function TutorialsCategoryPage() {
  return (
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-foreground">Tutorials</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Tutorial Articles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our collection of step-by-step guides and practical tutorials
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
    title: "Step-by-Step Guide to Setting Up a Development Environment",
    slug: "step-by-step-guide-to-setting-up-a-development-environment",
    readTime: 8,
    date: "July 19, 2026",
    category: "Tutorials",
    excerpt: "A complete walkthrough of setting up a modern development environment with all the essential tools and configurations."
  },
  {
    title: "How to Build a REST API with Express.js",
    slug: "how-to-build-a-rest-api-with-expressjs",
    readTime: 14,
    date: "July 17, 2026",
    category: "Coding",
    excerpt: "Learn the fundamentals of building RESTful APIs with Express.js, including routing, middleware, and database integration."
  },
  {
    title: "Data Visualization with D3.js",
    slug: "data-visualization-with-d3js",
    readTime: 18,
    date: "July 14, 2026",
    category: "Data",
    excerpt: "Create interactive data visualizations using D3.js, from basic charts to complex dashboard components."
  },
];
