"use client"

import { ScrollReveal } from "@/components/effects/ScrollReveal"

export default function Home() {
  const topics = [
    { name: "AI", slug: "ai", icon: "🤖", description: "Machine learning and AI engineering", count: 1 },
    { name: "Coding", slug: "coding", icon: "💻", description: "Programming languages and code", count: 0 },
    { name: "Data", slug: "data-analytics", icon: "📊", description: "Data analysis and visualization", count: 1 },
    { name: "Tutorials", slug: "tutorials", icon: "📚", description: "Step-by-step guides", count: 0 },
    { name: "Career", slug: "career", icon: "🎯", description: "Career switch and job search", count: 1 }
  ];

  const latestArticles = [
    {
      title: "25 Essential AI Tools Every Professional Should Know in 2026",
      slug: "25-ai-tools-2026",
      category: "AI",
      readTime: 18,
      description: "Discover the most transformative AI tools every professional needs to know in 2026, from productivity boosters to strategic decision-making platforms."
    },
    {
      title: "Break Into Data Analytics in 2026: Your Complete Guide",
      slug: "break-into-data-analytics-2026",
      category: "Data Analytics",
      readTime: 20,
      description: "A comprehensive roadmap for transitioning into data analytics, covering essential skills, tools, portfolio projects, and job market insights for 2026."
    },
    {
      title: "Resume Red Flags That Scare Tech Employers",
      slug: "resume-red-flags-tech-career",
      category: "Career",
      readTime: 15,
      description: "Learn to identify and fix common resume mistakes that make tech employers skip your application, with specific examples from real hiring data."
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
