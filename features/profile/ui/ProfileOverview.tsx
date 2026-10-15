"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthUser } from "@/shared/lib/useAuthUser"
import { useProfileContext } from "@/shared/lib/ProfileProvider"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import type { ReactNode } from "react"

function BetaPurchaseWrap({
  hint,
  children,
}: {
  hint: string
  children: ReactNode
}) {
  return (
    <span className="group relative inline-flex w-full sm:w-auto">
      <span className="w-full cursor-not-allowed sm:w-auto" title={hint}>
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 hidden w-max max-w-[16rem] -translate-x-1/2 rounded-md border border-heading/30 bg-app-darker px-3 py-2 text-center text-xs leading-5 text-on-dark opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
      >
        {hint}
      </span>
    </span>
  )
}

export default function ProfileOverview() {
  const t = useTranslations("profile")
  const user = useAuthUser()
  const { credits, loading } = useProfileContext()

  if (user === undefined || loading) {
    return <p className="text-sm text-on-dark/75">{t("loading")}</p>
  }

  if (user === null) {
    return (
      <div className="stack-card">
        <p className="text-sm text-on-dark/80">{t("unsigned")}</p>
        <Button asChild variant="cosmicPrimary" size="cosmicMd" className="w-fit">
          <Link href="/auth">{t("signIn")}</Link>
        </Button>
      </div>
    )
  }

  const isPremium = credits?.plan === "premium"
  const planName = isPremium ? t("planPremium") : t("planFree")
  const freeFeatures = [t("plans.free.features.f1"), t("plans.free.features.f2"), t("plans.free.features.f3")]
  const premiumFeatures = [
    t("plans.premium.features.f1"),
    t("plans.premium.features.f2"),
    t("plans.premium.features.f3"),
  ]

  return (
    <div className="stack-section">
      <p className="max-w-2xl rounded-md border border-heading/30 bg-black/15 px-3 py-2.5 text-sm leading-6 text-on-dark/85">
        {t("betaBanner")}
      </p>

      <Card className="card-light max-w-lg">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
              {t("emailLabel")}
            </p>
            <p className="break-all text-base font-medium text-primary">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
              {t("planLabel")}
            </p>
            <p className="inline-flex items-center gap-2 text-base font-medium text-primary">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  isPremium
                    ? "border-secondary/40 bg-secondary/10 text-secondary"
                    : "border-border-neutral bg-input text-primary",
                )}
              >
                {planName}
              </span>
            </p>
          </div>

          <Button asChild variant="cosmicPrimary" size="cosmicMd" className="w-fit">
            <Link href="/my-journeys">{t("goJourneys")}</Link>
          </Button>
        </CardContent>
      </Card>

      <section className="stack-card max-w-3xl">
        <header className="stack-tight">
          <h2 className="heading-4 mb-0 font-semibold text-on-dark">{t("membershipTitle")}</h2>
          <p className="text-sm leading-6 text-on-dark/80">{t("membershipIntro")}</p>
        </header>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-xl border border-white/15 bg-black/15 p-5">
            <div className="stack-tight">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-dark/70">
                {t("plans.free.name")}
              </p>
              <p className="text-2xl font-semibold text-heading">{t("plans.free.price")}</p>
              <p className="text-xs text-on-dark/70">{t("plans.free.period")}</p>
              <p className="text-sm leading-6 text-on-dark/80">{t("plans.free.description")}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-on-dark/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-heading" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <Button
                type="button"
                variant="cosmicTertiaryOnDark"
                size="cosmicMd"
                className="w-full"
                disabled
                aria-disabled="true"
              >
                {!isPremium ? t("plans.free.cta") : t("plans.free.ctaOther")}
              </Button>
            </div>
          </article>

          <article className="flex flex-col rounded-xl border border-heading/35 bg-black/20 p-5">
            <div className="stack-tight">
              <p className="text-xs font-semibold uppercase tracking-wide text-heading">
                {t("plans.premium.name")}
              </p>
              <p className="text-2xl font-semibold text-heading">{t("plans.premium.price")}</p>
              <p className="text-xs text-on-dark/70">{t("plans.premium.period")}</p>
              <p className="text-sm leading-6 text-on-dark/80">{t("plans.premium.description")}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-on-dark/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-heading" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-2 pt-5">
              {isPremium ? (
                <Button
                  type="button"
                  variant="cosmicTertiaryOnDark"
                  size="cosmicMd"
                  className="w-full"
                  disabled
                  aria-disabled="true"
                >
                  {t("plans.premium.ctaCurrent")}
                </Button>
              ) : (
                <BetaPurchaseWrap hint={t("betaPurchaseHint")}>
                  <Button
                    type="button"
                    variant="cosmicPrimary"
                    size="cosmicMd"
                    className="w-full"
                    disabled
                    aria-disabled="true"
                    aria-describedby="profile-beta-purchase-note"
                  >
                    {t("plans.premium.cta")}
                  </Button>
                </BetaPurchaseWrap>
              )}
              <p id="profile-beta-purchase-note" className="text-center text-xs leading-5 text-on-dark/75 sm:hidden">
                {t("betaPurchaseHint")}
              </p>
            </div>
          </article>
        </div>

        <p className="mt-4 text-sm text-on-dark/70">{t("comingSoonNote")}</p>
      </section>
    </div>
  )
}
