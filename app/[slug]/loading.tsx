import { BrandMark } from "@/components/shared/brand-mark";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecordingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-10 text-zinc-50 sm:py-16">
      <BrandMark />

      <div className="mt-8 flex flex-col items-center gap-2">
        <Skeleton className="h-7 w-64 rounded-full bg-white/5" />
        <Skeleton className="h-4 w-48 rounded-full bg-white/5" />
      </div>

      <Skeleton className="mx-auto mt-8 aspect-[9/16] w-full max-w-[380px] rounded-[2.5rem] bg-white/[0.04]" />

      <Skeleton className="mt-8 h-11 w-full max-w-[380px] rounded-full bg-white/5" />
    </div>
  );
}
