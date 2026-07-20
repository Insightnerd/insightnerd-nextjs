import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { ArticleAnimations } from "@/components/ArticleAnimations";

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

  return (
    <ArticleAnimations>
    <div className="max-w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span className="mx-2">/</span>
          <a href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-foreground transition-colors">
            {category}
          </a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{frontmatter.title as string}</span>
        </nav>

        <article>
          <header className="mb-10">
            <div className="mb-4">
              <span className="article-category">{category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {frontmatter.title as string}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span>{frontmatter.author as string}</span>
              <span>·</span>
              <span>{new Date(frontmatter.date as string).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span>·</span>
              <span>{frontmatter.reading_time as number} min read</span>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
            prose-pre:bg-muted prose-pre:border prose-pre:border-border
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-lg
            prose-hr:border-border
          ">
            {content}
          </div>
        </article>
      </div>
    </div>
    </ArticleAnimations>
  );
}
