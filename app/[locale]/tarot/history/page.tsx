import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import { tarotHistoryContent } from "@/shared/content/tarot"

export default function TarotHistoryPage() {
  return (
    <TarotPageShell title={tarotHistoryContent.title} intro={tarotHistoryContent.intro}>
      <div className="stack-section max-w-3xl">
        {tarotHistoryContent.sections.map((section) => (
          <section key={section.heading} className="stack-card">
            <h2 className="text-lg font-semibold text-primary">{section.heading}</h2>
            <p className="text-base leading-7 text-primary/85">{section.body}</p>
          </section>
        ))}
      </div>
    </TarotPageShell>
  )
}
