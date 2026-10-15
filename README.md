# CosmicTrack

Next.js (App Router) + Supabase + next-intl. Default locale: Turkish (`tr`); English under `/en/...`.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

All test code is **TypeScript**. Unit tests use **Vitest**; browser smoke uses **Playwright**.

### Commands

| Command | What it does |
|---------|----------------|
| `npm test` | Unit tests once (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | Playwright smoke (starts `next dev` if needed) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:all` | Unit + E2E |
| `npm run lint` | ESLint |

### Unit (Vitest)

Specs live next to source as `*.test.ts` (e.g. `shared/lib/aiCredits.test.ts`). Covered today:

- AI credit limits / period reset
- `buildMeaningFromPicks` (TR/EN locale)
- Tarot encyclopedia helpers (locale-aware)
- Shared Zod form schemas (auth, forgot/reset, journey, category, step)
- Auth callback URL helpers (`authUrls`)

Not covered yet (deferred): real email confirm/reset links, authenticated E2E (needs Supabase seed user).

```bash
npm test
```

### E2E smoke (Playwright)

Public flows only (no login/Supabase seed yet):

- `/` home
- `/tarot` library hub
- `/tarot/cards`
- `/auth` + `/auth?mode=forgot`
- `/en/tarot` locale prefix

**Local:** uses your installed Google Chrome (`channel: "chrome"`), so you usually do **not** need `npx playwright install`.

**CI:** installs Playwright Chromium via the workflow.

```bash
npm run test:e2e
```

If you prefer Playwright’s bundled Chromium locally:

```bash
npx playwright install chromium
CI=true npm run test:e2e
```

### CI

GitHub Actions (`.github/workflows/ci.yml`) on push/PR:

1. `npm ci` → `lint` → `npm test`
2. Playwright smoke with Chromium

### Current status (local)

| Suite | Result |
|-------|--------|
| Vitest unit | 38 passed (5 files) |
| Playwright smoke | 6 passed (public only) |
| ESLint | 0 errors (1 known RHF `watch` warning) |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright](https://playwright.dev)
- [Vitest](https://vitest.dev)
