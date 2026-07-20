"use client"

import { ScrollReveal } from "@/components/effects/ScrollReveal"

export default function ArticlePage() {
  return (
    <div className="max-w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-foreground transition-colors">
            <a href="/">Home</a>
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground transition-colors">
            <a href="/categories/ai">AI</a>
          </span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Article Title</span>
        </nav>

        <article>
          <header className="mb-12">
            <ScrollReveal>
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  AI
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                Building Scalable Backend Systems with Node.js
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>July 20, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>12 min read</span>
                </div>
              </div>
            </ScrollReveal>
          </header>

          <ScrollReveal delay={0.1}>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
              <p className="lead">
                Learn how to build scalable backend systems using Node.js and best practices for handling high-traffic applications.
              </p>

              <h2>Introduction</h2>
              <p>
                In today's competitive tech landscape, building a scalable backend system is crucial for any application's success. Whether you're running a startup or an established enterprise, your backend architecture determines how well your application can handle growth, traffic spikes, and evolving user demands.
              </p>

              <h2>Key Principles</h2>
              <p>
                When designing scalable systems, focus on these core principles: stateless services, horizontal scaling, efficient resource management, and robust error handling.
              </p>

              <h3>1. Stateless Services</h3>
              <p>
                Stateless services allow you to easily scale by adding more instances. Each request should be independent, carrying all necessary context within the request itself.
              </p>

              <h3>2. Horizontal Scaling</h3>
              <p>
                Instead of scaling vertically (adding more resources to a single server), scale horizontally by adding more servers to your cluster.
              </p>

              <h3>3. Efficient Resource Management</h3>
              <p>
                Implement caching, connection pooling, and efficient database queries to optimize resource usage.
              </p>

              <h2>Implementation Strategies</h2>
              <p>
                We'll explore practical implementation strategies including microservices architecture, message queues, and load balancing techniques.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="border-t pt-8 mt-12">
              <h3 className="text-2xl font-semibold mb-6">Related Articles</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="card p-6">
                  <div className="text-sm text-muted-foreground mb-2">Data</div>
                  <h4 className="font-semibold mb-2">
                    <a href="/posts/data-pipeline-architecture-for-analytics" className="hover:text-primary transition-colors">
                      Data Pipeline Architecture for Analytics
                    </a>
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Design and implement robust data pipelines...
                  </p>
                </div>
                <div className="card p-6">
                  <div className="text-sm text-muted-foreground mb-2">AI</div>
                  <h4 className="font-semibold mb-2">
                    <a href="/posts/ai-agents-practical-implementation-guide" className="hover:text-primary transition-colors">
                      AI Agents: Practical Implementation Guide
                    </a>
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    A comprehensive guide to implementing AI agents...
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-12">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                Share Article
              </button>
            </div>
          </ScrollReveal>
        </article>
      </div>
    </div>
  );
}
