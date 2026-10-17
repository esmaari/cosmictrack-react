import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // Playwright / some tools use 127.0.0.1 while `next dev` serves as localhost.
  allowedDevOrigins: ["127.0.0.1"],
}

export default withNextIntl(nextConfig)
