import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Styleguide | CosmicTrack",
  description: "Design tokens, global CSS utilities, and UI components used in CosmicTrack Pro.",
}

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return children
}
