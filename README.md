This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Automated Blog Post Image Generation

When a new MDX article is pushed to `master` (under `src/content/posts/`), a GitHub Actions workflow automatically generates a cover image using Hugging Face's free Inference API (**FLUX.1-schnell** model) and updates the post's frontmatter.

### Setup

1. **Get a Hugging Face access token:**
   - Create a free account at [huggingface.co](https://huggingface.co)
   - Go to **Settings → Access Tokens → New token**
   - Create a token with **Read** access (no write scope needed)
   - Copy the token

2. **Add `HF_TOKEN` to GitHub Secrets:**
   - Go to **Settings → Secrets and variables → Actions**
   - Add a new repository secret named `HF_TOKEN` with your Hugging Face token

3. **That's it.** The workflow fires automatically on every push touching `src/content/posts/**/*.mdx`.

### Running Locally for Testing

```powershell
# Generate images for posts changed since the last commit:
$env:HF_TOKEN="your_token_here"; npm run generate-images

# Generate for specific files (useful for testing):
$env:HF_TOKEN="your_token_here"; npx tsx scripts/generate-post-images.ts src/content/posts/my-new-post.mdx

# Generate all posts without existing cover_image:
$env:HF_TOKEN="your_token_here"; npx tsx scripts/generate-post-images.ts
```

```bash
# (macOS / Linux / Git Bash)
HF_TOKEN=your_token_here npm run generate-images
HF_TOKEN=your_token_here npx tsx scripts/generate-post-images.ts src/content/posts/my-new-post.mdx
```

> **Note on free-tier performance:** Hugging Face's free Inference API queues requests on shared GPUs. The first call may take 15-30 seconds (cold start) — this is normal. The script retries up to 3 times with 8-second delays if it hits a timeout.

> **Note on re-generation:** The script skips posts that already have a `cover_image` field in their frontmatter. To regenerate an existing image, delete the `cover_image` line from the post's frontmatter first.

### How It Works

1. Detects changed MDX files via `git diff HEAD~1` (or accepts explicit file paths as CLI args).
2. Reads each post's title and excerpt from frontmatter.
3. Builds a concise image-generation prompt.
4. Calls `black-forest-labs/FLUX.1-schnell` via the `@huggingface/inference` SDK.
5. Saves the resulting PNG to `public/images/posts/{slug}.png`.
6. Updates the post's frontmatter: `cover_image: "/images/posts/{slug}.png"`.
7. Errors on individual posts don't crash the batch — failures are logged and the script continues.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?blank-next-app&_gl=1*1vlttvn*_gcl_au*MTI2MDI0NjIyNi4xNzM5MjE2MDQ1) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
