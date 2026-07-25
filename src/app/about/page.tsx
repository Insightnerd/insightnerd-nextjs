import { ContentPageAnimations } from "@/components/ContentPageAnimations";
import { Bot, Code2, BarChart3, BookOpen, Target, Sparkles } from "lucide-react";

const topics = [
  { icon: Bot, name: "AI & Machine Learning", desc: "Practical guides to building and working with AI systems" },
  { icon: Code2, name: "Coding", desc: "Deep dives into programming languages and development practices" },
  { icon: BarChart3, name: "Data Analysis", desc: "Techniques for pipelines, analysis, and insights" },
  { icon: BookOpen, name: "Tutorials", desc: "Step-by-step guides that actually work in production" },
  { icon: Target, name: "Career", desc: "Real advice for transitions, hunting, and growth" },
];

export default function AboutPage() {
  return (
    <ContentPageAnimations>
    <div className="max-w-full">
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            About
          </div>
          <h1 className="text-4xl font-bold mb-4">About InsightNerd</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Practitioner-written guides for the modern technologist.
          </p>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              InsightNerd is your go-to destination for practical, practitioner-written guides about AI, coding, data analysis, and career development in tech.
            </p>
            <p>
              Our mission is simple: <strong>decode the signal, skip the noise.</strong>
            </p>
            <p>
              Unlike clickbait listicles and affiliate-padded tutorials, InsightNerd is built by people who have actually used the tools, shipped real code, and navigated career transitions in tech. We provide guides that are testable, actionable, and written from the trenches.
            </p>
            <h2>Our Story</h2>
            <p>
              Started in 2026 as a response to the overwhelming amount of poorly-written AI tutorials and &ldquo;10X life-changing&rdquo; coding guides, InsightNerd was created by a team of developers, data analysts, and career-switchers who were tired of fluff.
            </p>
            <p>
              We wanted a resource that lived up to the &ldquo;Nerd&rdquo; in our name — built with technical rigor, practical examples, and honest writing.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">What We Cover</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div key={t.name} className="flex items-start gap-4 rounded-xl border border-border bg-muted p-5">
                <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-muted p-6 text-center">
            <h2 className="text-xl font-bold mb-3">Join the Community</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Got questions, suggestions, or want to contribute? Reach out and let&apos;s build something great together.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
    </ContentPageAnimations>
  );
}
