export default function CommunityArticlesPage() {
  return (
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-foreground">Community Articles</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Community Articles</h1>
          <p className="text-xl text-muted-foreground">
            Discover articles and discussions from our community of developers and practitioners
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
              New community articles are landing soon. Check back later!
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
    category: "Community",
    excerpt: "A practical guide to building scalable backend systems using Node.js, with insights from real-world deployments and best practices."
  },
  {
    title: "AI Agents: Practical Implementation Guide",
    slug: "ai-agents-practical-implementation-guide",
    readTime: 15,
    date: "July 18, 2026",
    category: "Community",
    excerpt: "Community-contributed guide to implementing AI agents, with diverse perspectives on concepts, challenges, and implementation strategies."
  },
  {
    title: "Data Pipeline Architecture for Analytics",
    slug: "data-pipeline-architecture-for-analytics",
    readTime: 10,
    date: "July 15, 2026",
    category: "Community",
    excerpt: "Community insights on designing and implementing robust data pipelines that can handle large volumes of data while maintaining performance and reliability."
  },
  {
    title: "How to Build a REST API with Express.js",
    slug: "how-to-build-a-rest-api-with-expressjs",
    readTime: 14,
    date: "July 17, 2026",
    category: "Coding",
    excerpt: "Community guide on the fundamentals of building RESTful APIs with Express.js, including routing, middleware, and database integration."
  },
  {
    title: "Data Visualization with D3.js",
    slug: "data-visualization-with-d3js",
    readTime: 18,
    date: "July 14, 2026",
    category: "Data",
    excerpt: "Community insights on creating interactive data visualizations using D3.js, from basic charts to complex dashboard components."
  },
  {
    title: "Navigating a Career Switch into Tech",
    slug: "navigating-a-career-switch-into-tech",
    readTime: 20,
    date: "July 16, 2026",
    category: "Career",
    excerpt: "Real-world advice and insights from community members who have successfully made career transitions into tech."
  },
  {
    title: "Step-by-Step Guide to Setting Up a Development Environment",
    slug: "step-by-step-guide-to-setting-up-a-development-environment",
    readTime: 8,
    date: "July 19, 2026",
    category: "Tutorials",
    excerpt: "Community contributions to setting up a modern development environment with all the essential tools and configurations."
  },
];
