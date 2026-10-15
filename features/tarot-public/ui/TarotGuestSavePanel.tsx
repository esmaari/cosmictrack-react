"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useAuthUser } from "@/shared/lib/useAuthUser"
import { useTranslations } from "next-intl"

export default function TarotGuestSavePanel() {
  const t = useTranslations("tarot")
  const user = useAuthUser()

  if (user === undefined || user !== null) {
    return null
  }

  return (
    <section className="mt-10 border-t border-white/10 pt-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="stack-tight max-w-xl">
          <h2 className="heading-4 mb-0 font-semibold text-heading">{t("savePanel.title")}</h2>
          <p className="text-sm leading-6 text-on-dark/80">{t("savePanel.body")}</p>
        </div>
        <Button asChild variant="cosmicSecondary" size="cosmicMd" className="shrink-0">
          <Link href="/auth?mode=register">{t("savePanel.button")}</Link>
        </Button>
      </div>
    </section>
  )
}
