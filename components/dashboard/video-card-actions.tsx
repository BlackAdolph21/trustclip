"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Download, Loader2, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const TRASH_LIMIT = 10;

const outlineButtonClassName =
  "flex-1 border-white/15 bg-transparent text-zinc-100 hover:bg-white/5";

type VideoCardActionsProps = {
  videoId: string | number;
  videoUrl: string | null;
  businessId: string;
  status: "Pending" | "Approved" | "Rejected";
};

export function VideoCardActions({
  videoId,
  videoUrl,
  businessId,
  status,
}: VideoCardActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Keeps the trash from growing without bound: once this business has more
  // than TRASH_LIMIT rejected videos, the oldest one is purged for good.
  const enforceTrashLimit = async () => {
    const { data: rejectedVideos } = await supabase
      .from("videos")
      .select("id, created_at")
      .eq("business_id", businessId)
      .eq("status", "Rejected")
      .order("created_at", { ascending: true });

    if (rejectedVideos && rejectedVideos.length > TRASH_LIMIT) {
      const oldest = rejectedVideos[0];
      await supabase.from("videos").delete().eq("id", oldest.id);
    }
  };

  const updateStatus = async (
    newStatus: "Approved" | "Rejected" | "Pending",
    { checkTrashLimit = false, successMessage = "" }: {
      checkTrashLimit?: boolean;
      successMessage?: string;
    } = {}
  ) => {
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("videos")
        .update({ status: newStatus })
        .eq("id", videoId);

      if (error) throw error;

      if (checkTrashLimit) {
        await enforceTrashLimit();
      }

      if (successMessage) toast.success(successMessage);
      router.refresh();
    } catch (error) {
      console.error(`Failed to update video status to ${newStatus}:`, error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteVideo = async () => {
    setIsProcessing(true);

    try {
      const { error } = await supabase.from("videos").delete().eq("id", videoId);
      if (error) throw error;

      toast.success("Testimonial permanently deleted.");
      router.refresh();
    } catch (error) {
      console.error("Failed to permanently delete video:", error);
      toast.error("Something went wrong while deleting this testimonial. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    setIsDownloading(true);

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch video.");
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `testimonial-${videoId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Failed to download video:", error);
      toast.error("Something went wrong while downloading this video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (status === "Pending") {
    return (
      <CardFooter className="gap-3 pt-2">
        <Button
          className="flex-1"
          onClick={() =>
            updateStatus("Approved", { successMessage: "Testimonial approved." })
          }
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          Approve
        </Button>
        <Button
          variant="outline"
          className={outlineButtonClassName}
          onClick={() =>
            updateStatus("Rejected", {
              checkTrashLimit: true,
              successMessage: "Testimonial moved to trash.",
            })
          }
          disabled={isProcessing}
        >
          <X className="size-4" />
          Reject
        </Button>
      </CardFooter>
    );
  }

  if (status === "Approved") {
    return (
      <CardFooter className="gap-3 pt-2">
        <Button
          className="flex-1"
          onClick={handleDownload}
          disabled={isDownloading || isProcessing || !videoUrl}
        >
          {isDownloading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="size-4" />
              Download Video
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className={outlineButtonClassName}
          onClick={() =>
            updateStatus("Rejected", {
              checkTrashLimit: true,
              successMessage: "Testimonial moved to trash.",
            })
          }
          disabled={isProcessing || isDownloading}
        >
          <Trash2 className="size-4" />
          Move to Trash
        </Button>
      </CardFooter>
    );
  }

  return (
    <CardFooter className="gap-3 pt-2">
      <Button
        variant="outline"
        className={outlineButtonClassName}
        onClick={() =>
          updateStatus("Pending", { successMessage: "Testimonial restored." })
        }
        disabled={isProcessing}
      >
        <RotateCcw className="size-4" />
        Restore
      </Button>
      <Button
        variant="destructive"
        className="flex-1"
        onClick={deleteVideo}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
        Delete Permanently
      </Button>
    </CardFooter>
  );
}
