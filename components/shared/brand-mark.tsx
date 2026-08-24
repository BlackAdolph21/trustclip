import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

/**
 * The floating, glassmorphic wordmark lockup shared by every screen that
 * isn't the main marketing nav (auth, password reset, recording) — same
 * materials as `SiteHeader` so the whole app reads as one product.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-slate-950/70 px-6 py-2.5 shadow-lg shadow-black/30 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        TrustClip
      </span>
    </Link>
  );
}
