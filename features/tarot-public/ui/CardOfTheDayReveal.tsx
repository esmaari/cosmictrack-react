"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { routing } from "@/i18n/routing"

type CardOfTheDayRevealProps = {
  cardName: string
  meaning: string
  dayKey: string
  dailyMessage: string
  /** Home desktop: left-aligned with the copy column. */
  align?: "center" | "start"
}

export default function CardOfTheDayReveal({
  cardName,
  meaning,
  dayKey,
  dailyMessage,
  align = "center",
}: CardOfTheDayRevealProps) {
  const t = useTranslations("tarot.daily")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle")
  const start = align === "start"

  const shareUrl = () => {
    const path =
      locale === routing.defaultLocale ? "/tarot/daily" : `/${locale}/tarot/daily`
    if (typeof window === "undefined") return path
    return `${window.location.origin}${path}`
  }

  const onShare = async () => {
    const url = shareUrl()
    const title = t("shareTitle", { name: cardName })
    const text = t("shareText", { name: cardName })

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text, url })
        setShareState("shared")
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setShareState("copied")
      }
    } catch {
      return
    }

    window.setTimeout(() => setShareState("idle"), 2000)
  }

  return (
    <div className={cn("w-full", start ? "md:max-w-none" : "mx-auto max-w-md")}>
      <p
        className={cn(
          "font-body text-base leading-7 text-on-dark/85",
          start ? "text-center md:text-left" : "text-center",
        )}
      >
        {dailyMessage}
      </p>

      {open ? (
        <p
          id={`cotd-meaning-${dayKey}`}
          className={cn(
            "mt-4 whitespace-pre-line border-t border-white/10 pt-4 font-body text-base leading-7 text-on-dark/90",
            start ? "text-center md:text-left" : "text-center",
          )}
        >
          {meaning}
        </p>
      ) : null}

      <div
        className={cn(
          "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
          start ? "items-center md:items-start md:justify-start" : "items-center sm:justify-center",
        )}
      >
        <Button
          type="button"
          variant="cosmicSecondary"
          size="cosmicMd"
          aria-expanded={open}
          aria-controls={`cotd-meaning-${dayKey}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("hideMeaning") : t("exploreMessage")}
          {!open ? <span aria-hidden> →</span> : null}
        </Button>

        <button
          type="button"
          onClick={() => void onShare()}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-heading/90 transition-colors hover:text-btn-link-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
          aria-label={t("shareAria")}
        >
          {shareState === "copied" || shareState === "shared" ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Share2 className="size-4" aria-hidden />
          )}
          {shareState === "copied"
            ? t("linkCopied")
            : shareState === "shared"
              ? t("shared")
              : t("share")}
        </button>
      </div>
    </div>
  )
}
