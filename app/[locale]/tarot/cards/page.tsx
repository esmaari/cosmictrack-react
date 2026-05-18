import TarotCardsBrowser from "@/features/tarot-public/ui/TarotCardsBrowser"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"

export default function TarotCardsPage() {
  return (
    <TarotPageShell
      title="Kart ansiklopedisi"
      intro="Her kart için kısa özet, anahtar kelimeler ve sembolizm. Okuma satırları (düz/ters) yalnızca demo çekim ve üye alanında kullanılır."
    >
      <TarotCardsBrowser />
    </TarotPageShell>
  )
}
