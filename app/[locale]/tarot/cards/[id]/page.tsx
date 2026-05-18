import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import { Button } from "@/components/ui/button"
import { getEncyclopediaEntryById, tarotEncyclopediaEntries } from "@/shared/content/tarot"

type PageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return tarotEncyclopediaEntries.map((card) => ({ id: String(card.id) }))
}

export default async function TarotCardDetailPage({ params }: PageProps) {
  const { id } = await params
  const cardId = Number(id)
  if (Number.isNaN(cardId)) notFound()

  const card = getEncyclopediaEntryById(cardId)
  if (!card) notFound()

  return (
    <TarotPageShell title={card.name} backHref="/tarot/cards" backLabel="Kartlar">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr] lg:items-start">
        <div className="relative mx-auto aspect-6/11 w-full max-w-[240px] overflow-hidden rounded-lg border-2 border-solar-gold bg-shadow-veil shadow-md">
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            sizes="240px"
            priority
          />
        </div>

        <div className="stack-section min-w-0">
          <p className="text-sm font-medium text-secondary">
            {card.arcana === "Major" ? "Major Arcana" : card.suit ?? "Minor Arcana"}
            {card.arcana === "Minor" ? ` · ${card.number}` : ` · ${card.number}`}
          </p>

          <div className="flex flex-wrap gap-2">
            {card.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-cosmic-indigo/20 bg-input px-2.5 py-1 text-xs font-medium text-primary"
              >
                {keyword}
              </span>
            ))}
          </div>

          <section className="stack-card">
            <h2 className="text-lg font-semibold text-primary">Özet</h2>
            <p className="text-base leading-7 text-primary/85">{card.summary}</p>
          </section>

          <section className="stack-card">
            <h2 className="text-lg font-semibold text-primary">Sembolizm</h2>
            <p className="text-base leading-7 text-primary/85">{card.symbolism}</p>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cosmicSecondary" size="cosmicMd">
              <Link href="/tarot/ask">Kartlara sor (demo)</Link>
            </Button>
            <Button asChild variant="cosmicPrimary" size="cosmicMd">
              <Link href="/auth?mode=register">Okumayı kaydet</Link>
            </Button>
          </div>
        </div>
      </div>
    </TarotPageShell>
  )
}
