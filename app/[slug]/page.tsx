import { notFound } from "next/navigation";

import { RecorderClient } from "@/components/recording/RecorderClient";
import { createClient } from "@/utils/supabase/server";

export default async function BusinessRecordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <RecorderClient
      businessId={profile.id}
      businessName={profile.business_name ?? "this business"}
    />
  );
}
