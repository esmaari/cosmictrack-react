import { getTranslations } from "next-intl/server"

export default async function ProfilePage() {
  const t = await getTranslations("profile")

  return (
    <div className="space-y-2">
      <h1 className="heading-3 mb-2 p-4 font-semibold text-on-dark">{t("title")}</h1>
      <p className="px-4 text-sm text-on-dark/75">
        {t("subtitle")}
      </p>
    </div>
  )
}
