import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { getAllPosts } from "@/lib/posts";
import { ArticlesList } from "@/components/ArticlesList";

export default function ArticlesPage() {
  const articles = getAllPosts();

  return (
    <div className="max-w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Articles</span>
        </nav>

        <ScrollReveal>
          <h1 className="text-4xl font-bold mb-2">All Articles</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Guides written by practitioners, not theorists.
          </p>
        </ScrollReveal>

        <ArticlesList articles={articles} />
      </div>
    </div>
  );
}
