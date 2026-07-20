import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center space-y-2 md:items-start">
            <span className="text-lg font-bold">InsightNerd</span>
            <p className="text-sm text-muted-foreground">
              Decode the signal. Skip the noise.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            &copy; 2026 InsightNerd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
