import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import { tarotSymbolsContent } from "@/shared/content/tarot"

export default function TarotSymbolsPage() {
  return (
    <TarotPageShell title={tarotSymbolsContent.title} intro={tarotSymbolsContent.intro}>
      <div className="stack-section">
        <div className="grid gap-4 sm:grid-cols-2">
          {tarotSymbolsContent.suits.map((suit) => (
            <article
              key={suit.id}
              className="rounded-lg border border-cosmic-indigo/15 bg-input p-4 sm:p-5"
            >
              <h2 className="text-lg font-semibold text-primary">{suit.name}</h2>
              <p className="mt-1 text-sm font-medium text-secondary">
                {suit.element} · {suit.themes}
              </p>
              <p className="mt-3 text-base leading-7 text-primary/85">{suit.body}</p>
            </article>
          ))}
        </div>

        <section className="stack-card max-w-3xl">
          <h2 className="text-lg font-semibold text-primary">
            {tarotSymbolsContent.majorArcanaNote.heading}
          </h2>
          <p className="text-base leading-7 text-primary/85">
            {tarotSymbolsContent.majorArcanaNote.body}
          </p>
        </section>
      </div>
    </TarotPageShell>
  )
}
