"use client"

import { ScrollReveal } from "@/components/effects/ScrollReveal"

export default function Home() {
  const topics = [
    { name: "AI", slug: "ai", icon: "🤖", description: "Machine learning and AI engineering", count: 3 },
    { name: "Coding", slug: "coding", icon: "💻", description: "Programming languages and code", count: 2 },
    { name: "Data", slug: "data-analytics", icon: "📊", description: "Data analysis and visualization", count: 4 },
    { name: "Tutorials", slug: "tutorials", icon: "📚", description: "Step-by-step guides", count: 8 },
    { name: "Career", slug: "career", icon: "🎯", description: "Career switch and job search", count: 1 }
  ];

  const latestArticles = [
    {
      title: "Building Scalable Backend Systems with Node.js",
      slug: "building-scalable-backend-systems-with-nodejs",
      category: "Coding",
      readTime: 12,
      description: "Learn how to build scalable backend systems using Node.js and best practices for handling high-traffic applications."
    },
    {
      title: "AI Agents: Practical Implementation Guide",
      slug: "ai-agents-practical-implementation-guide",
      category: "AI",
      readTime: 15,
      description: "A comprehensive guide to implementing AI agents, from basic concepts to advanced deployment strategies in production environments."
    },
    {
      title: "Data Pipeline Architecture for Analytics",
      slug: "data-pipeline-architecture-for-analytics",
      category: "Data",
      readTime: 10,
      description: "Design and implement robust data pipelines that can handle large volumes of data while maintaining performance and reliability."
    }
  ];

  const handleTopicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Topic clicked");
  };

  const handleTopicMouseEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Topic mouse entered");
  };

  const handleArticleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Article clicked");
  };

  return (
    <div className="max-w-full w-full">
      {/* Hero Section */}
      <section className="hero-section">
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
              {topics.map((topic, index) => (
                <div
                  key={topic.slug}
                  className="stat-item"
                  onClick={handleTopicClick}
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
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

      {/* Browse Topics Section */}
      <section id="browse-topics">
        <div className="max-w-full">
          <div className="max-c">
            <ScrollReveal>
              <h2 className="section-title">
                Browse by Topic
              </h2>
              <p className="section-desc">
                Jump into the topics that matter most to you
              </p>
            </ScrollReveal>

            <div className="topics-grid">
              {topics.map((topic, index) => (
                <a
                  key={topic.slug}
                  href={`/categories/${topic.slug}`}
                  className="topic-card"
                  onMouseEnter={handleTopicMouseEnter}
                  onClick={handleTopicClick}
                >
                  <div className="topic-icon">
                    {topic.icon}
                  </div>
                  <div className="topic-name">
                    {topic.name}
                  </div>
                </a>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section id="latest-articles">
          <div className="max-w-full">
            <div className="max-c">
              <ScrollReveal>
                <h2 className="section-title">
                  Latest Articles
                </h2>
                <p className="section-desc">
                  Fresh content from our library
                </p>
              </ScrollReveal>
              <div className="articles-list">
                {latestArticles.map((article) => (
                  <a
                    key={article.slug}
                    href={`/posts/${article.slug}`}
                    className="article-card"
                    onClick={handleArticleClick}
                  >
                    <div className="article-meta">
                      <div className="article-category">
                        {article.category}
                      </div>
                      <div className="article-stats">
                        📖 {article.readTime} min
                      </div>
                    </div>
                    <div className="article-title">
                      {article.title}
                    </div>
                    <div className="article-desc">
                      {article.description.substring(200)}...
                    </div>
                  </a>
                ))}
          </div>
          </div>
          </div>
        </section>
      </div>
      );
    }
