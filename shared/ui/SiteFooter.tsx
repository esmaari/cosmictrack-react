"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const footerHrefs = ["/about", "/impressum", "/privacy"] as const

const footerMessageKeys = {
  "/about": "about",
  "/impressum": "impressum",
  "/privacy": "privacy"

} as const satisfies Record<(typeof footerHrefs)[number], string>

export default function SiteFooter() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const year = new Date().getFullYear()

  const linkClass = (href: string) =>
    cn(
      "inline-flex min-h-10 items-center rounded-sm px-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-link-light-focus focus-visible:ring-offset-2 focus-visible:ring-offset-footer-heading",
      pathname === href ? "text-btn-link-light" : "text-heading/85 hover:text-btn-link-light",
    )

  return (
    <footer className="mt-auto shrink-0 border-t border-heading/30 bg-footer-heading py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <nav
          aria-label={t("footerNav")}
          className="flex flex-wrap justify-center gap-6 md:justify-start"
        >
          {footerHrefs.map((href) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {t(footerMessageKeys[href])}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm text-on-dark md:text-right">{t("copyright", { year })}</p>
      </div>
    </footer>
  )
}
