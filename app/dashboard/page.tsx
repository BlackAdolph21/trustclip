import { redirect } from "next/navigation";
import { Film } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionLinkCard } from "@/components/dashboard/collection-link-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { VideoCardActions } from "@/components/dashboard/video-card-actions";
import { createClient } from "@/utils/supabase/server";

type VideoStatus = "Pending" | "Approved" | "Rejected";

type VideoRow = {
  id: string | number;
  customer_name: string | null;
  created_at: string;
  status: string | null;
  video_url: string | null;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const STATUS_BADGE_CLASSNAME: Record<VideoStatus, string> = {
  Pending: "absolute right-3 top-3 border-none bg-amber-500 text-amber-950",
  Approved: "absolute right-3 top-3 border-none bg-emerald-500 text-emerald-950",
  Rejected: "absolute right-3 top-3 border-none bg-zinc-700 text-zinc-200",
};

function VideoGrid({
  videos,
  status,
  businessId,
  emptyMessage,
}: {
  videos: VideoRow[];
  status: VideoStatus;
  businessId: string;
  emptyMessage: string;
}) {
  if (videos.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <Film className="size-8 text-zinc-600" />
        <p className="max-w-sm text-sm text-zinc-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card
          key={video.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-50 shadow-none ring-0 transition-colors hover:bg-white/[0.05]"
        >
          <CardContent className="flex flex-col gap-4">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800">
              {video.video_url ? (
                <video
                  src={video.video_url}
                  controls
                  preload="metadata"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Film className="size-8 text-zinc-600" />
                </div>
              )}
              <Badge className={STATUS_BADGE_CLASSNAME[status]}>{status}</Badge>
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-zinc-50">
                {video.customer_name ?? "Anonymous"}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-zinc-500">
                Recorded on {formatDate(video.created_at)}
              </CardDescription>
            </div>
          </CardContent>

          <VideoCardActions
            videoId={video.id}
            videoUrl={video.video_url}
            businessId={businessId}
            status={status}
          />
        </Card>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  const testimonials = (videos ?? []) as VideoRow[];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const collectionLink = profile?.slug ? `${baseUrl}/${profile.slug}` : null;

  // Any lingering "New" or missing statuses from before the moderation
  // workflow existed are treated as Pending.
  const pendingVideos = testimonials.filter(
    (video) => video.status !== "Approved" && video.status !== "Rejected"
  );
  const approvedVideos = testimonials.filter((video) => video.status === "Approved");
  const trashVideos = testimonials.filter((video) => video.status === "Rejected");

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">TrustClip</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}!
            </h1>
            {profile?.business_name && (
              <p className="mt-1.5 text-sm text-zinc-500">{profile.business_name}</p>
            )}
            <p className="mt-3 text-base text-zinc-400">
              Every video your clients record lands here, ready to review and share.
            </p>
          </div>
          <p className="whitespace-nowrap text-sm text-zinc-500">
            {testimonials.length} {testimonials.length === 1 ? "video" : "videos"} collected
          </p>
        </div>

        {collectionLink && <CollectionLinkCard url={collectionLink} />}

        <Tabs defaultValue="pending" className="mt-10">
          <TabsList className="w-fit gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <TabsTrigger
              value="pending"
              className="rounded-full px-4 text-zinc-400 data-[state=active]:bg-white/10 data-[state=active]:text-zinc-50"
            >
              Pending
              {pendingVideos.length > 0 && (
                <span className="ml-1.5 text-xs text-zinc-500">{pendingVideos.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="rounded-full px-4 text-zinc-400 data-[state=active]:bg-white/10 data-[state=active]:text-zinc-50"
            >
              Approved
              {approvedVideos.length > 0 && (
                <span className="ml-1.5 text-xs text-zinc-500">{approvedVideos.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="trash"
              className="rounded-full px-4 text-zinc-400 data-[state=active]:bg-white/10 data-[state=active]:text-zinc-50"
            >
              Trash
              {trashVideos.length > 0 && (
                <span className="ml-1.5 text-xs text-zinc-500">{trashVideos.length}</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <VideoGrid
              videos={pendingVideos}
              status="Pending"
              businessId={user.id}
              emptyMessage="You're all caught up. New submissions will show up here for you to review."
            />
          </TabsContent>

          <TabsContent value="approved">
            <VideoGrid
              videos={approvedVideos}
              status="Approved"
              businessId={user.id}
              emptyMessage="You haven't approved any testimonials yet. Approve one from your Pending tab to see it here."
            />
          </TabsContent>

          <TabsContent value="trash">
            <p className="text-xs text-zinc-500">
              Videos in trash are permanently deleted after 30 days or when the trash
              exceeds 10 items.
            </p>
            <VideoGrid
              videos={trashVideos}
              status="Rejected"
              businessId={user.id}
              emptyMessage="Your trash is empty."
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
