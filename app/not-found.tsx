import Link from "next/link";
import { Compass } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16 text-center text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="mb-8">
        <BrandMark />
      </div>

      <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
        <Compass className="size-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        The link you followed may be broken, or the page may have moved.
      </p>
      <Button size="lg" className="mt-8" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
