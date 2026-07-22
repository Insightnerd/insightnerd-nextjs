import Link from "next/link"
import { HomeAnimations } from "@/components/HomeAnimations"
import { SplineHeroBackground } from "@/components/SplineHeroBackground"
import { getAllPosts } from "@/lib/posts"

export default function Home() {
  const allPosts = getAllPosts()

  const categoryConfig = [
    { name: "AI", slug: "ai", icon: "🤖", description: "Machine learning and AI engineering" },
    { name: "Coding", slug: "coding", icon: "💻", description: "Programming languages and code" },
    { name: "Data", slug: "data-analytics", icon: "📊", description: "Data analysis and visualization" },
    { name: "Tutorials", slug: "tutorials", icon: "📚", description: "Step-by-step guides" },
    { name: "Career", slug: "career", icon: "🎯", description: "Career switch and job search" }
  ]

  const topics = categoryConfig.map((c) => ({
    ...c,
    count: allPosts.filter((p) =>
      p.categories.some((cat) => cat.toLowerCase() === c.name.toLowerCase())
    ).length,
  }))

  const latestArticles = allPosts.slice(0, 3)

  return (
    <HomeAnimations>
      <div className="max-w-full w-full">
      {/* Hero Section */}
      <section className="hero-section">
        <SplineHeroBackground />
        <div className="max-w-full">
          <div className="max-c">
            <div className="max-c-inner">
              <div className="max-c-inner-inner">
                <h1 className="max-h1">
                  Decode the signal. Skip the noise.
                </h1>
                <p className="max-p">
                  Guides written by practitioners, not theorists.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

      {/* Animated Stats Strip */}
      <section className="stats-section">
        <div className="max-w-full">
          <div className="max-c">
            <div className="max-c-inner">
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/categories/${topic.slug}`}
                  className="stat-item"
                >
                  <div className="stat-icon">
                    {topic.icon}
                  </div>
                  <div className="stat-count">
                    {topic.count} +Guides
                  </div>
                  <div className="stat-name">
                    {topic.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          </div>
        </section>

      {/* Browse Topics Section */}
      <section id="browse-topics">
        <div className="max-w-full">
          <div className="max-c">
            <h2 className="section-title">
              Browse by Topic
            </h2>
            <p className="section-desc">
              Jump into the topics that matter most to you
            </p>

            <div className="topics-grid">
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/categories/${topic.slug}`}
                  className="topic-card"
                >
                  <div className="topic-icon">
                    {topic.icon}
                  </div>
                  <div className="topic-name">
                    {topic.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section id="latest-articles">
          <div className="max-w-full">
            <div className="max-c">
              <h2 className="section-title">
                Latest Articles
              </h2>
              <p className="section-desc">
                Fresh content from our library
              </p>
              <div className="articles-list">
                {latestArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/posts/${article.slug}`}
                    className="article-card"
                  >
                    <div className="article-meta">
                      <div className="article-category">
                        {article.categories[0]}
                      </div>
                      <div className="article-stats">
                        📖 {article.reading_time} min
                      </div>
                    </div>
                    <div className="article-title">
                      {article.title}
                    </div>
                    <div className="article-desc">
                      {article.excerpt}
                    </div>
                  </Link>
                ))}
            </div>
            </div>
            </div>
          </section>
        </div>
      </HomeAnimations>
    );
  }
