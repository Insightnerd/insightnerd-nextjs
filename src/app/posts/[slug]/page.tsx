import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getAllPosts, formatPostDate } from "@/lib/posts";
import { ArticleAnimations } from "@/components/ArticleAnimations";
import { CategoryBanner } from "@/components/CategoryBanner";
import { JsonLd } from "@/components/JsonLd";

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

function getRelatedPosts(slug: string, category: string) {
  return getAllPosts()
    .filter(
      (p) =>
        p.slug !== slug &&
        p.categories.some((c: string) => c.toLowerCase() === category.toLowerCase()),
    )
    .slice(0, 3);
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
              author: { "@type": "Person", name: frontmatter.author },
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
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.insightnerd.in/" },
                { "@type": "ListItem", position: 2, name: category, item: `https://www.insightnerd.in/categories/${category.toLowerCase().replace(/\s+/g, "-")}` },
                { "@type": "ListItem", position: 3, name: frontmatter.title as string, item: `https://www.insightnerd.in/posts/${slug}` },
              ],
            }}
          />

          <article className="article-root">
            <div className="lg:grid lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8 xl:gap-12">
              <aside className="toc-wrapper lg:sticky lg:top-24 lg:self-start" data-toc>
                <h3 className="toc-label">On this page</h3>
                <nav className="toc-list" data-toc-list />
              </aside>

              <div className="min-w-0">
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
                  <div className="cover-image-wrapper">
                    <img src={coverImage} alt={`Cover image for ${frontmatter.title as string}`} loading="eager" />
                  </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:relative prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-img:rounded-lg prose-hr:border-border">
                  {content}
                </div>
              </div>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="flex flex-col gap-4">
                {relatedPosts.map((related) => {
                  const catClass = (related.categories[0] || "").toLowerCase();
                  return (
                    <a
                      key={related.slug}
                      href={`/posts/${related.slug}`}
                      className={`article-card ${catClass}-card`}
                    >
                      <div className="article-meta">
                        <span className="article-category">{related.categories[0]}</span>
                        <span className="article-stats">
                          {formatPostDate(related.date)} · {related.reading_time} min read
                        </span>
                      </div>
                      <h3 className="article-title">{related.title}</h3>
                      <p className="article-desc">{related.excerpt}</p>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </ArticleAnimations>
  );
}
