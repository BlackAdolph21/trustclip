"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard failed to render:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <DashboardHeader />

      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <TriangleAlert className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          Something went wrong loading your dashboard
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
          This is on us, not you. Please try again — if it keeps happening,
          refresh the page or come back in a moment.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
