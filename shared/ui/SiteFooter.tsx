"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/impressum", label: "Impressum (Legal Disclosure)" },
  { href: "/privacy", label: "Privacy" },
  { href: "/styleguide", label: "Styleguide" },
] as const

export default function SiteFooter() {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    cn(
      "text-sm transition-colors",
      pathname === href
        ? "text-btn-link-light hover:text-btn-link-light-hover"
        : "text-btn-link-light-pressed",
    )

  return (
    <footer className="sticky bottom-0 z-40 mt-auto shrink-0 bg-footer-heading py-6 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
          {footerLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm text-on-dark md:text-right">
          &copy; {new Date().getFullYear()} CosmicTrack. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
