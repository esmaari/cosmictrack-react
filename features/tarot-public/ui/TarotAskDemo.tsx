"use client"

import { Link } from "@/i18n/navigation"
import { useState } from "react"
import CardPicker from "@/features/step-save/ui/CardPicker"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { Button } from "@/components/ui/button"

export default function TarotAskDemo() {
  const [question, setQuestion] = useState("")

  return (
    <div className="stack-section">
      <p className="rounded-md border border-cosmic-indigo/20 bg-input px-3 py-2 text-sm leading-6 text-primary/80">
        Bu demo yalnızca CosmicTrack kart metinlerini gösterir. AI veya hesap kaydı kullanılmaz.
      </p>

      <div className="max-w-xl">
        <label className="mb-1 block text-xs font-medium text-primary">Soru veya niyet (isteğe bağlı)</label>
        <CosmicInput
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Örn. Bu ay neye odaklanmalıyım?"
        />
      </div>

      <CardPicker mode="demo" question={question} />

      <div className="flex flex-col gap-3 border-t border-cosmic-indigo/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-6 text-primary/80">
          Okumalarını journey olarak kaydetmek ve planına göre AI yorumu almak için hesap oluştur.
        </p>
        <Button asChild variant="cosmicPrimary" size="cosmicMd" className="shrink-0">
          <Link href="/auth?mode=register">Ücretsiz kayıt ol</Link>
        </Button>
      </div>
    </div>
  )
}
