import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Users, GitFork, BookOpen, MessageSquare, Mail, ExternalLink } from "lucide-react";

export default function CommunityPage() {
  const articles = getAllPosts();

  const categoryCount = articles.reduce<Record<string, number>>((acc, a) => {
    a.categories.forEach((c: string) => {
      acc[c] = (acc[c] || 0) + 1;
    });
    return acc;
  }, {});

  const totalReadingTime = articles.reduce((sum, a) => sum + a.reading_time, 0);
  const authors = [...new Set(articles.map((a) => a.author))];

  return (
    <div className="max-w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Community</span>
        </nav>

        <h1 className="text-4xl font-bold mb-3">Community</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Join the InsightNerd community — share ideas, contribute articles, and connect with fellow practitioners.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-xl border border-border bg-muted p-5 text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{articles.length}</div>
            <div className="text-xs text-muted-foreground">Articles Published</div>
          </div>
          <div className="rounded-xl border border-border bg-muted p-5 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{authors.length}</div>
            <div className="text-xs text-muted-foreground">Contributors</div>
          </div>
          <div className="rounded-xl border border-border bg-muted p-5 text-center">
            <GitFork className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{Object.keys(categoryCount).length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="rounded-xl border border-border bg-muted p-5 text-center">
            <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(totalReadingTime / articles.length)}</div>
            <div className="text-xs text-muted-foreground">Avg Read Time (min)</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(categoryCount)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium text-sm">{cat}</span>
                  <span className="text-xs text-muted-foreground">{count} articles</span>
                </Link>
              ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Contributors</h2>
          <div className="flex flex-wrap gap-2">
            {authors.map((author) => (
              <span key={author} className="rounded-full border border-border bg-background px-4 py-1.5 text-sm">
                {author}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted p-6">
          <h2 className="text-xl font-bold mb-4">Get Involved</h2>
          <p className="text-sm text-muted-foreground mb-5">
            InsightNerd is built by the community, for the community. Here is how you can participate:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="https://github.com/Insightnerd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">GitHub</div>
                <div className="text-xs text-muted-foreground">Contribute & discuss</div>
              </div>
            </a>
            <a
              href="https://x.com/insightnerd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">X / Twitter</div>
                <div className="text-xs text-muted-foreground">Follow for updates</div>
              </div>
            </a>
            <a
              href="mailto:insightnerd@outlook.com"
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:border-primary/30 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-xs text-muted-foreground">Send us a message</div>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Browse All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
