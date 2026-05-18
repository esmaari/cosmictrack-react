import TarotAskDemo from "@/features/tarot-public/ui/TarotAskDemo"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"

export default function TarotAskPage() {
  return (
    <TarotPageShell
      title="Kartlara sor"
      intro="Üç kart seç ve onayla. Düz veya ters pozisyona göre klasik anlamlar gösterilir — yapay zeka kullanılmaz."
    >
      <TarotAskDemo />
    </TarotPageShell>
  )
}
