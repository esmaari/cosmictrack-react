import { getTranslations } from "next-intl/server"

export default async function AboutPage() {
  const t = await getTranslations("about")

  return (
    <main className="mx-auto min-h-0 w-full max-w-2xl flex-1 bg-surface px-4 py-12 text-primary md:px-6">
      <div className="stack-section">
        <h1 className="heading-3 font-semibold">{t("title")}</h1>
        <p className="text-base leading-7 text-primary/85">{t("paragraph1")}</p>
        <p className="text-base leading-7 text-primary/85">{t("paragraph2")}</p>
        <ul className="list-none space-y-2 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">{t("emailLabel")}:</strong> esmaari.dev@gmail.com
          </li>
          <li>
            <strong className="text-primary">{t("instagramLabel")}:</strong> @kozmiktarotesma
          </li>
          <li>
            <strong className="text-primary">{t("githubLabel")}:</strong>{" "}
            <a
              href="https://github.com/esmaari"
              className="text-btn-link-dark underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github.com/esmaari
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
