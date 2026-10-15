import { getTranslations } from "next-intl/server"
import ProfileOverview from "@/features/profile/ui/ProfileOverview"

export default async function ProfilePage() {
  const t = await getTranslations("profile")

  return (
    <div className="stack-section">
      <header className="space-y-2">
        <h1 className="heading-3 mb-0 font-semibold text-on-dark">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-6 text-on-dark/80">{t("subtitle")}</p>
      </header>
      <ProfileOverview />
    </div>
  )
}
