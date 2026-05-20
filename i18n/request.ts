import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const [nav, common, home, tarot] = await Promise.all([
    import(`../messages/${locale}/nav.json`),
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/tarot.json`)
  ])

  return {
    locale,
    messages: {
      nav: nav.default,
      common: common.default,
      home: home.default,
      tarot: tarot.default,
    },
  }
})
