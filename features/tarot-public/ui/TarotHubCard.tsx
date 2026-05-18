import { Link } from "@/i18n/navigation"

type TarotHubCardProps = {
  href: string
  title: string
  description: string
}

export default function TarotHubCard({ href, title, description }: TarotHubCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-lg border border-cosmic-indigo/20 bg-input p-4 shadow-sm transition-colors hover:border-secondary/40 hover:bg-surface sm:p-5"
    >
      <h2 className="text-lg font-semibold text-primary sm:text-xl">{title}</h2>
      <p className="text-sm leading-6 text-primary/80 sm:text-base">{description}</p>
    </Link>
  )
}
