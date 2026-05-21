import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const [
    nav,
    common,
    home,
    tarot,
    auth,
    journeys,
    steps,
    categories,
    favorites,
    profile,
    impressum,
    about,
    privacy,
  ] = await Promise.all([
    import(`../messages/${locale}/nav.json`),
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/tarot.json`),
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/journeys.json`),
    import(`../messages/${locale}/steps.json`),
    import(`../messages/${locale}/categories.json`),
    import(`../messages/${locale}/favorites.json`),
    import(`../messages/${locale}/profile.json`),
    import(`../messages/${locale}/impressum.json`),
    import(`../messages/${locale}/about.json`),
    import(`../messages/${locale}/privacy.json`),
  ])

  return {
    locale,
    messages: {
      nav: nav.default,
      common: common.default,
      home: home.default,
      tarot: tarot.default,
      auth: auth.default,
      journeys: journeys.default,
      steps: steps.default,
      categories: categories.default,
      favorites: favorites.default,
      profile: profile.default,
      impressum: impressum.default,
      about: about.default,
      privacy: privacy.default,
    },
  }
})
