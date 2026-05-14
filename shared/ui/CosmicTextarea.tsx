"use client"

import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * Cosmic-themed textarea for light surfaces (dialogs, cards).
 * Styling matches {@link CosmicInput}; wraps shadcn Textarea.
 */
const CosmicTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, readOnly, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      readOnly={readOnly}
      className={cn(
        "min-h-24 w-full resize-y bg-input px-3 py-2 text-primary",
        "placeholder:text-light",
        "disabled:opacity-60",
        readOnly
          ? "cursor-default border-0 bg-transparent pl-0 opacity-70 focus-visible:outline-none focus-visible:ring-0"
          : [
              "rounded-md border border-border-neutral focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring-neutral",
              "aria-invalid:border-2 aria-invalid:border-error aria-invalid:ring-0",
            ],
        className,
      )}
      {...props}
    />
  )
})
CosmicTextarea.displayName = "CosmicTextarea"

export { CosmicTextarea }
