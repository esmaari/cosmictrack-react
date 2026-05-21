const COLOR_KEY_BY_VALUE: Record<string, string> = {
  "bg-cat-neutral": "neutral",
  "bg-cat-energy": "energy",
  "bg-cat-love": "love",
  "bg-cat-nature": "nature",
  "bg-cat-spiritual": "spiritual",
  "bg-cat-priority": "priority",
  "bg-cat-knowledge": "knowledge",
  "bg-cat-work": "work",
}

export function getCategoryColorLabel(value: string, t: (key: string) => string): string {
  const key = COLOR_KEY_BY_VALUE[value]
  return key ? t(key) : value
}
