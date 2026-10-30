"use client"

import { useTranslations } from "next-intl"

/** First focusable control: jump past header chrome for keyboard users. */
export default function SkipToContentLink() {
  const t = useTranslations("nav")

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring-neutral"
    >
      {t("skipToContent")}
    </a>
  )
}
