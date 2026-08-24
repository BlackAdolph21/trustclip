"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CollectionLinkCardProps = {
  url: string;
};

export function CollectionLinkCard({ url }: CollectionLinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Something went wrong while copying your link. Please try again.");
    }
  };

  return (
    <Card className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-50 shadow-none ring-0">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Link2 className="size-4 text-indigo-400" />
          Your Collection Link
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
            className="border-white/10 bg-white/5 text-zinc-300 sm:flex-1"
          />
          <Button
            type="button"
            variant="outline"
            className="sm:w-40"
            onClick={handleCopy}
          >
            {isCopied ? (
              <span className="animate-in fade-in-0 zoom-in-95 flex items-center gap-1.5 text-emerald-400 duration-200">
                <Check className="size-4" />
                Copied!
              </span>
            ) : (
              <>
                <Copy className="size-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-zinc-500">
          Share this link anywhere to start collecting video testimonials.
        </p>
      </CardContent>
    </Card>
  );
}
