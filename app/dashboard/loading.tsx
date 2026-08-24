import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <Skeleton className="aspect-video w-full rounded-xl bg-white/5" />
      <Skeleton className="mt-4 h-4 w-2/5 rounded-full bg-white/5" />
      <Skeleton className="mt-2 h-3 w-1/3 rounded-full bg-white/5" />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-full bg-white/5" />
        <Skeleton className="h-9 flex-1 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <DashboardHeader>
        <Skeleton className="h-8 w-20 rounded-full bg-white/5" />
      </DashboardHeader>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-64 rounded-full bg-white/5" />
            <Skeleton className="h-4 w-40 rounded-full bg-white/5" />
          </div>
          <Skeleton className="h-4 w-32 rounded-full bg-white/5" />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Skeleton className="h-4 w-36 rounded-full bg-white/5" />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-9 flex-1 rounded-3xl bg-white/5" />
            <Skeleton className="h-9 w-full rounded-3xl bg-white/5 sm:w-40" />
          </div>
        </div>

        <div className="mt-10 flex w-fit gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-7 w-20 rounded-full bg-white/0" />
          <Skeleton className="h-7 w-16 rounded-full bg-white/0" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
