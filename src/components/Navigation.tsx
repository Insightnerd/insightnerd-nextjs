"use client"

import { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const categories = [
  { name: "AI", slug: "ai" },
  { name: "Coding", slug: "coding" },
  { name: "Data", slug: "data-analytics" },
  { name: "Tutorials", slug: "tutorials" },
  { name: "Career", slug: "career" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">InsightNerd</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="nav-link text-sm font-medium transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/about" className="nav-link text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="nav-link text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("insightnerd-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      setTheme(prefersLight ? "light" : "dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("insightnerd-theme", theme);
  }, [theme, mounted]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hidden md:flex"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="theme-icon-wrapper">
        <div
          className="theme-icon"
          style={{
            opacity: theme === "dark" ? 1 : 0,
            transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.75)",
          }}
        >
          <Sun className="h-4 w-4" />
        </div>
        <div
          className="theme-icon"
          style={{
            opacity: theme === "light" ? 1 : 0,
            transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.75)",
          }}
        >
          <Moon className="h-4 w-4" />
        </div>
      </div>
    </Button>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sheet-content">
        <div className="flex flex-col space-y-4 mt-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/about" className="text-lg font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-lg font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
