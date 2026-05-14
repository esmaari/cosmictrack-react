/** Short locale date for cards (e.g. Jan 12, 2025). */
export function formatCreatedAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d)
}
