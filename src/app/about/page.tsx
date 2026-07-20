import { ContentPageAnimations } from "@/components/ContentPageAnimations";

export default function AboutPage() {
  return (
    <ContentPageAnimations>
    <div className="max-w-full">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">About InsightNerd</h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              InsightNerd is your go-to destination for practical, practitioner-written guides about AI, coding, data analysis, and career development in tech.
            </p>
            <p>
              Our mission is simple: decode the signal, skip the noise.
            </p>
            <p>
              Unlike clickbait listicles and affiliate-padded tutorials, InsightNerd is built by people who have actually used the tools, shipped real code, and navigated career transitions in tech. We provide guides that are testable, actionable, and written from the trenches.
            </p>

            <h2>Our Story</h2>
            <p>
              Started in 2026 as a response to the overwhelming amount of poorly-written AI tutorials and "10X life-changing" coding guides, InsightNerd was created by a team of developers, data analysts, and career-switchers who were tired of fluff.
            </p>
            <p>
              We wanted a resource that lived up to the "Nerd" in our name - built with technical rigor, practical examples, and honest writing.
            </p>

            <h2>What We Cover</h2>
            <p>Explore our curated collection of topics:</p>
            <ul>
              <li><strong>AI & Machine Learning:</strong> Practical guides to building, implementing, and working with AI systems</li>
              <li><strong>Coding:</strong> Deep dives into programming languages, frameworks, and development practices</li>
              <li><strong>Data Analysis:</strong> Techniques for working with data, building pipelines, and extracting insights</li>
              <li><strong>Tutorials:</strong> Step-by-step guides that actually work in production</li>
              <li><strong>Career:</strong> Real advice for career transitions, job hunting, and professional growth in tech</li>
            </ul>

            <h2>Join the Community</h2>
            <p>
              We believe in the power of community feedback and continuous improvement. Got questions, suggestions, or want to contribute? Reach out and let's build something great together.
            </p>
          </div>
        </div>
      </section>
    </div>
    </ContentPageAnimations>
  );
}
