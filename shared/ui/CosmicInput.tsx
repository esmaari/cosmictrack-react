"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * Cosmic-themed input for light surfaces (dialogs, cards).
 * Wraps shadcn Input; does not modify components/ui/input.tsx defaults beyond merged className.
 */
const CosmicInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, type, readOnly, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type={type}
        readOnly={readOnly}
        className={cn(
          "h-auto w-full bg-input px-3 py-2 text-primary",
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
  },
)
CosmicInput.displayName = "CosmicInput"

export { CosmicInput }
