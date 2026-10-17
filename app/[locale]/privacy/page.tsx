import { getTranslations } from "next-intl/server"

export default async function PrivacyPage() {
  const t = await getTranslations("privacy")

  return (
    <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 bg-surface px-4 py-10 text-primary sm:py-12 md:px-6">
      <article className="stack-section">
        <header className="stack-tight">
          <h1 className="heading-3 font-semibold">{t("title")}</h1>
          <p className="text-base leading-7 text-primary/85">{t("intro")}</p>
        </header>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("collect.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("collect.item1")}</li>
            <li>{t("collect.item2")}</li>
            <li>{t("collect.item3")}</li>
            <li>{t("collect.item4")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("why.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("why.item1")}</li>
            <li>{t("why.item2")}</li>
            <li>{t("why.item3")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("cookies.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("cookies.item1")}</li>
            <li>{t("cookies.item2")}</li>
            <li>{t("cookies.item3")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("processors.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("processors.item1")}</li>
            <li>{t("processors.item2")}</li>
            <li>{t("processors.item3")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("ai.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("ai.item1")}</li>
            <li>{t("ai.item2")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">
            {t("dosAndDonts.title")}{" "}
            <span className="font-normal">{t("dosAndDonts.titleSuffix")}</span>
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("dosAndDonts.item1")}</li>
            <li>{t("dosAndDonts.item2")}</li>
            <li>{t("dosAndDonts.item3")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("choices.title")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>{t("choices.item1")}</li>
            <li>{t("choices.item2")}</li>
            <li>{t("choices.item3")}</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">{t("questions.title")}</h2>
          <p className="text-base leading-7 text-primary/85">
            {t("questions.bodyBefore")}{" "}
            <a
              href="mailto:esmaari.dev@gmail.com"
              className="font-medium text-btn-link-dark underline underline-offset-4 hover:text-btn-link-dark-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
            >
              esmaari.dev@gmail.com
            </a>
            {t("questions.bodyAfter")}
          </p>
        </section>
      </article>
    </main>
  )
}
