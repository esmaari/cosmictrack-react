"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthUser } from "@/shared/lib/useAuthUser"
import { useTranslations } from "next-intl"
import { Check, Sparkles } from "lucide-react"
import DeleteAccountButton from "./DeleteAccountButton"

export default function ProfileOverview() {
  const t = useTranslations("profile")
  const user = useAuthUser()

  if (user === undefined) {
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

  const freeFeatures = [
    t("plans.free.features.f1"),
    t("plans.free.features.f2"),
    t("plans.free.features.f3"),
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
              <span className="inline-flex rounded-full border border-border-neutral bg-input px-2.5 py-0.5 text-xs font-semibold text-primary">
                {t("planFree")}
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

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
                {t("plans.free.cta")}
              </Button>
            </div>
          </article>

          <article className="flex flex-col rounded-xl border border-dashed border-heading/40 bg-black/10 p-5">
            <div className="stack-tight">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-heading">
                <Sparkles className="size-3.5" aria-hidden />
                {t("aiPreview.eyebrow")}
              </p>
              <p className="text-2xl font-semibold text-heading">{t("aiPreview.title")}</p>
              <p className="text-sm leading-6 text-on-dark/80">{t("aiPreview.body")}</p>
            </div>
            <div className="mt-auto pt-5">
              <Button
                type="button"
                variant="cosmicTertiaryOnDark"
                size="cosmicMd"
                className="w-full"
                disabled
                aria-disabled="true"
              >
                {t("aiPreview.cta")}
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="stack-card max-w-3xl rounded-xl border border-error/35 bg-black/15 p-5">
        <header className="stack-tight">
          <h2 className="heading-4 mb-0 font-semibold text-heading">{t("deleteAccount.sectionTitle")}</h2>
          <p className="text-sm leading-6 text-on-dark/80">{t("deleteAccount.sectionBody")}</p>
        </header>
        <div className="mt-4">
          <DeleteAccountButton email={user.email ?? ""} />
        </div>
      </section>
    </div>
  )
}
