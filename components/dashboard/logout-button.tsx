"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Something went wrong while logging out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="size-4" />
      Log out
    </Button>
  );
}
