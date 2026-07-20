"use client";

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
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[hsl(260_100%_65%)] shrink-0" />
                <a
                  href="mailto:insightnerd@outlook.com"
                  className="text-muted-foreground hover:text-[hsl(260_100%_65%)] transition-colors text-sm"
                >
                  insightnerd@outlook.com
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
