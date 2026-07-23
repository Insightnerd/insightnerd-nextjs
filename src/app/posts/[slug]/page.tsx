import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getAllPosts } from "@/lib/posts";
import { ArticleAnimations } from "@/components/ArticleAnimations";
import { CategoryBanner } from "@/components/CategoryBanner";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const source = getPostBySlug(slug);
  if (!source) return { title: "Not Found" };

  const { frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    options: { parseFrontmatter: true },
  });

  return {
    title: `${frontmatter.title as string} — InsightNerd`,
    description: frontmatter.excerpt as string,
  };
}

function getRelatedPosts(
  slug: string,
  category: string,
  count = 6,
) {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const sameCategory = all.filter((p) =>
    p.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
  );

  if (sameCategory.length >= count) return sameCategory.slice(0, count);

  // Backfill with recent posts from other categories
  const others = all.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...others].slice(0, count);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const source = getPostBySlug(slug);

  if (!source) {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    options: { parseFrontmatter: true },
  });

  const category = Array.isArray(frontmatter.categories)
    ? frontmatter.categories[0]
    : (frontmatter.categories as string) ?? "";
  const coverImage = frontmatter.cover_image as string | undefined;
  const relatedPosts = getRelatedPosts(slug, category);

  return (
    <ArticleAnimations>
      <div className="max-w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CategoryBanner category={category} />
          <nav className="text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a
              href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-foreground transition-colors"
            >
              {category}
            </a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{frontmatter.title as string}</span>
          </nav>

          <JsonLd
            id="article-schema"
            data={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: frontmatter.title,
              datePublished: frontmatter.date,
              author: {
                "@type": "Person",
                name: frontmatter.author,
              },
              description: frontmatter.excerpt,
              image: coverImage ?? "https://www.insightnerd.in/og-image.png",
            }}
          />
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
                  name: category,
                  item: `https://www.insightnerd.in/categories/${category.toLowerCase().replace(/\s+/g, "-")}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: frontmatter.title as string,
                  item: `https://www.insightnerd.in/posts/${slug}`,
                },
              ],
            }}
          />

          <article className="article-root">
            <header className="mb-10">
              <div className="mb-4">
                <span className="article-category">{category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {frontmatter.title as string}
              </h1>
              <div className="meta-line flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span>{frontmatter.author as string}</span>
                <span>·</span>
                <span>{new Date(frontmatter.date as string).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>·</span>
                <span>{frontmatter.reading_time as number} min read</span>
              </div>
            </header>

            {coverImage && (
              <div
                className="cover-image-wrapper"
              >
                <img
                  src={coverImage}
                  alt={`Cover image for ${frontmatter.title as string}`}
                  loading="eager"
                />
              </div>
            )}

            <aside className="toc-wrapper" data-toc>
              <h3 className="toc-label">On this page</h3>
              <nav className="toc-list" data-toc-list />
            </aside>

            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:relative
                prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-lg
                prose-hr:border-border
              "
            >
              {content}
            </div>
          </article>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <section id="related-articles" className="mt-16 pt-12 border-t border-border">
              <h2 className="section-title text-left mb-2">
                Related Articles
              </h2>
              <p className="section-desc text-left mb-0">
                Continue reading on similar topics
              </p>
              <div className="related-carousel -mx-3 px-3 mt-8" data-slider="related">
                {relatedPosts.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/posts/${article.slug}`}
                    className="article-card block"
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
            </section>
          )}
        </div>
      </div>
    </ArticleAnimations>
  );
}
