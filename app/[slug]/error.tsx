"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function RecordingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Recording page failed to render:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-10 text-center text-zinc-50 sm:py-16">
      <BrandMark />

      <div className="mt-16 flex flex-col items-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <TriangleAlert className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
          We couldn&apos;t load this recording page. Please try again in a
          moment.
        </p>
        <Button size="lg" className="mt-8" onClick={reset}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
