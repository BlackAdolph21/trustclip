import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full min-w-0 resize-y rounded-3xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-base transition-[color,box-shadow,background-color,border-color] duration-200 outline-none placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-ring focus-visible:bg-white/[0.05] focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
