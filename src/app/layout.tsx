import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LenisProvider } from "@/components/LenisProvider";
import { PageTransition } from "@/components/PageTransition";
import { SubscribeModal } from "@/components/SubscribeModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsightNerd",
  description: "Decode the signal. Skip the noise.",
  metadataBase: new URL("https://www.insightnerd.in"),
  openGraph: {
    title: "InsightNerd",
    description: "Decode the signal. Skip the noise.",
    url: "https://www.insightnerd.in",
    siteName: "InsightNerd",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InsightNerd - Decode the signal, skip the noise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InsightNerd",
    description: "Decode the signal. Skip the noise.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('insightnerd-theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                }
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LenisProvider>
          <Navigation />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <SubscribeModal />
        </LenisProvider>
      </body>
    </html>
  );
}

