"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const footerHrefs = ["/about", "/impressum", "/privacy", "/styleguide"] as const

const footerMessageKeys = {
  "/about": "about",
  "/impressum": "impressum",
  "/privacy": "privacy",
  "/styleguide": "styleguide",
} as const satisfies Record<(typeof footerHrefs)[number], string>

export default function SiteFooter() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const year = new Date().getFullYear()

  const linkClass = (href: string) =>
    cn(
      "text-sm transition-colors",
      pathname === href
        ? "text-btn-link-light-pressed"
        : "text-btn-link-light hover:text-btn-link-light-hover",
    )

  return (
    <footer className="sticky bottom-0 z-40 mt-auto shrink-0 border-t border-heading/30 bg-footer-heading py-6 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
          {footerHrefs.map((href) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {t(footerMessageKeys[href])}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm text-on-dark md:text-right">{t("copyright", { year })}</p>
      </div>
    </footer>
  )
}
