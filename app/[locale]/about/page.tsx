import { getTranslations } from "next-intl/server"

export default async function AboutPage() {
  const t = await getTranslations("about")

  return (
    <main className="mx-auto min-h-0 w-full max-w-2xl flex-1 bg-surface px-4 py-10 text-primary sm:py-12 md:px-6">
      <div className="stack-section">
        <h1 className="heading-3 font-semibold">{t("title")}</h1>
        <p className="text-base leading-7 text-primary/85">{t("paragraph1")}</p>
        <p className="text-base leading-7 text-primary/85">{t("paragraph2")}</p>
        <ul className="list-none space-y-3 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">{t("emailLabel")}:</strong>{" "}
            <a
              href="mailto:esmaari.dev@gmail.com"
              className="font-medium text-secondary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
            >
              esmaari.dev@gmail.com
            </a>
          </li>
          <li>
            <strong className="text-primary">{t("instagramLabel")}:</strong>{" "}
            <a
              href="https://instagram.com/kozmiktarotesma"
              className="font-medium text-secondary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
              target="_blank"
              rel="noreferrer"
            >
              @kozmiktarotesma
            </a>
          </li>
          <li>
            <strong className="text-primary">{t("githubLabel")}:</strong>{" "}
            <a
              href="https://github.com/esmaari"
              className="font-medium text-secondary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
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
