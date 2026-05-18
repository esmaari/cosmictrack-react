import { Link } from "@/i18n/navigation"
import TarotHubCard from "@/features/tarot-public/ui/TarotHubCard"
import { Button } from "@/components/ui/button"

export default function TarotHubPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 bg-surface px-4 py-8 text-primary sm:px-6 sm:py-10">
      <div className="stack-section">
        <header className="stack-card max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary">COSMICTRACK</p>
          <h1 className="heading-3 font-semibold">Tarot kartları</h1>
          <p className="text-base leading-7 text-primary/85">
            Kartları öğren, sembolleri keşfet veya üç kartlık bir demo çekim dene. Journey kaydı ve AI
            yorumu için ücretsiz hesap oluşturabilirsin.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <TarotHubCard
            href="/tarot/cards"
            title="Kart ansiklopedisi"
            description="78 kartın özeti, anahtar kelimeleri ve sembolizmi."
          />
          <TarotHubCard
            href="/tarot/symbols"
            title="Semboller"
            description="Dört suit ve Major Arcana temaları."
          />
          <TarotHubCard
            href="/tarot/history"
            title="Kısa tarih"
            description="Tarotun kökenleri ve CosmicTrack ile ilişkisi."
          />
          <TarotHubCard
            href="/tarot/ask"
            title="Kartlara sor"
            description="Üç kart seç, klasik düz/ters anlamları oku. Demo — AI yok."
          />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-cosmic-indigo/15 bg-app/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-primary">Journey&apos;lerini kaydet</h2>
            <p className="mt-1 text-sm leading-6 text-primary/80 sm:text-base">
              Okumalarını adım adım sakla, kategorilere ayır ve planına göre AI yorumu al.
            </p>
          </div>
          <Button asChild variant="cosmicPrimary" size="cosmicMd" className="shrink-0">
            <Link href="/auth?mode=register">Ücretsiz hesap oluştur</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
