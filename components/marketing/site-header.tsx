"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavLink = { label: string; href: string };

type SiteHeaderProps = {
  navLinks: NavLink[];
};

export function SiteHeader({ navLinks }: SiteHeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Keeps the mobile panel from lingering open across breakpoint changes or
  // an accidental resize while it's expanded.
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 shadow-lg shadow-black/30 backdrop-blur-xl sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              TrustClip
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-slate-50"
              >
                {link.label}
                <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-indigo-400 to-blue-400 transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:bg-white/5 hover:text-slate-50"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                asChild
              >
                <Link href="/login?tab=signup">Get Started Free</Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              className="flex size-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-50 md:hidden"
            >
              {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          className={`mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
            isMobileOpen
              ? "max-h-[24rem] opacity-100"
              : "pointer-events-none max-h-0 border-transparent opacity-0"
          }`}
        >
          <nav className="flex flex-col p-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-50"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t border-white/10 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-300 hover:bg-white/5 hover:text-slate-50"
              asChild
            >
              <Link href="/login" onClick={closeMobileMenu}>
                Log in
              </Link>
            </Button>
            <Button size="sm" className="w-full" asChild>
              <Link href="/login?tab=signup" onClick={closeMobileMenu}>
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
