import Link from "next/link";
import { Mail } from "lucide-react";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "All Posts", href: "/posts" },
      { label: "AI", href: "/categories/ai" },
      { label: "Data Analytics", href: "/categories/data-analytics" },
      { label: "Career", href: "/categories/career" },
      { label: "Coding", href: "/categories/coding" },
      { label: "Tutorials", href: "/categories/tutorials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Community", href: "/community" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 lg:mb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14 z-40 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-16 pb-10 sm:pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <span className="text-[hsl(260_100%_65%)] text-2xl font-extrabold">
                &lt;/&gt;
              </span>
              <span className="text-foreground text-2xl font-bold">
                Insight<span className="text-[hsl(260_100%_65%)]">Nerd</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Decode the signal. Skip the noise.
            </p>
          </div>

          {/* Link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground text-sm font-semibold mb-5 tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-[hsl(260_100%_65%)] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-foreground text-sm font-semibold mb-5 tracking-wider uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=insightnerd@outlook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-muted-foreground hover:text-[hsl(260_100%_65%)] transition-colors text-sm"
                >
                  <Mail size={16} className="text-[hsl(260_100%_65%)] shrink-0" />
                  <span>Gmail</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Insightnerd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-muted-foreground hover:text-[hsl(260_100%_65%)] transition-colors text-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-[hsl(260_100%_65%)]" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/insightnerd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-muted-foreground hover:text-[hsl(260_100%_65%)] transition-colors text-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-[hsl(260_100%_65%)]" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-t border-border my-6 sm:my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} InsightNerd. All rights reserved.
          </p>
        </div>
      </div>

      {/* Large hover text effect — hidden on small screens */}
      <div className="hidden lg:flex h-[28rem] -mt-48 -mb-36">
        <TextHoverEffect text="InsightNerd" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
