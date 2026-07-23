import Link from "next/link";
import { CategoryPageAnimations } from "@/components/CategoryPageAnimations";
import { CategoryBanner } from "@/components/CategoryBanner";
import { JsonLd } from "@/components/JsonLd";
import { getPostsByCategory, formatPostDate } from "@/lib/posts";

export default function CodingCategoryPage() {
  const articles = getPostsByCategory("Coding");

  return (
    <CategoryPageAnimations>
    <div className="max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryBanner category="Coding" />
        <div className="mb-12">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Coding</span>
          </nav>
          <JsonLd
            id="breadcrumb-schema"
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.insightnerd.in/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Coding",
                  item: "https://www.insightnerd.in/categories/coding",
                },
              ],
            }}
          />
          <h1 className="text-4xl font-bold mb-4">Coding Articles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our collection of programming guides and development best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.slug} href={`/posts/${article.slug}`} className="article-card">
              <div className="article-meta">
                <div className="article-category">{article.categories[0]}</div>
                <div className="article-stats">{article.reading_time} min · {formatPostDate(article.date)}</div>
              </div>
              <div className="article-title">{article.title}</div>
              <div className="article-desc line-clamp-3">{article.excerpt}</div>
            </Link>
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
    </CategoryPageAnimations>
  );
}
