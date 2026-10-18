"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { routing } from "@/i18n/routing"

type CardOfTheDayRevealProps = {
  cardName: string
  meaning: string
  dayKey: string
  dailyMessage: string
}

export default function CardOfTheDayReveal({
  cardName,
  meaning,
  dayKey,
  dailyMessage,
}: CardOfTheDayRevealProps) {
  const t = useTranslations("tarot.daily")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle")

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
    <div className="mx-auto w-full max-w-md">
      <p className="font-body text-center text-base leading-7 text-on-dark/85">
        {dailyMessage}
      </p>

      {open ? (
        <p
          id={`cotd-meaning-${dayKey}`}
          className="mt-4 whitespace-pre-line border-t border-white/10 pt-4 font-body text-center text-base leading-7 text-on-dark/90"
        >
          {meaning}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
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
