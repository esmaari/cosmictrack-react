import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const [nav, common] = await Promise.all([
    import(`../messages/${locale}/nav.json`),
    import(`../messages/${locale}/common.json`),
  ])

  return {
    locale,
    messages: {
      nav: nav.default,
      common: common.default,
    },
  }
})
