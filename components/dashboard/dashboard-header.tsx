import type { ReactNode } from "react";
import Link from "next/link";

type DashboardHeaderProps = {
  children?: ReactNode;
};

/**
 * Same floating glass-pill materials as the public `SiteHeader`, so the
 * transition from the marketing site into the authenticated app feels
 * seamless rather than like a different product.
 */
export function DashboardHeader({ children }: DashboardHeaderProps) {
  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 shadow-lg shadow-black/30 backdrop-blur-xl sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              TrustClip
            </span>
          </Link>
          {children}
        </div>
      </div>
    </header>
  );
}
