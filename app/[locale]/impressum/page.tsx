import { getTranslations } from "next-intl/server"

export default async function ImpressumPage() {
  const t = await getTranslations("impressum")

  return (
    <main className="mx-auto min-h-0 w-full max-w-2xl flex-1 bg-surface px-4 py-10 text-primary sm:py-12 md:px-6">
      <div className="stack-section">
        <h1 className="heading-3 font-semibold">{t("title")}</h1>
        <h2 className="heading-4 font-semibold text-primary">{t("subtitle")}</h2>

        <p className="text-base leading-7 text-primary/85">{t("intro")}</p>
        <ul className="list-none space-y-3 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">{t("nameLabel")}:</strong> {t("nameValue")}
          </li>
          <li>
            <strong className="text-primary">{t("addressLabel")}:</strong> {t("addressValue")}
          </li>
          <li>
            <strong className="text-primary">{t("emailLabel")}:</strong>{" "}
            <a
              href={`mailto:${t("emailValue")}`}
              className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
            >
              {t("emailValue")}
            </a>
          </li>
        </ul>
        <p className="text-sm leading-6 text-primary/70">{t("note")}</p>
      </div>
    </main>
  )
}
