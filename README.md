# CosmicTrack

Next.js (App Router) + Supabase + next-intl. Default locale: Turkish (`tr`); English under `/en/...`.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill URL + PUBLISHABLE_KEY (+ SECRET_KEY for account delete)
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
- AI reading schema (`parseAiReading` golden fixtures)
- `askAI` error mapping (`LIMIT_REACHED`, empty, disabled, invalid reading)
- API auth guards: `POST`/`DELETE` `/api/categories` and `/api/steps` → 401 without session
- `buildMeaningFromPicks` (TR/EN locale)
- Tarot encyclopedia helpers (locale-aware)
- Shared Zod form schemas (auth, forgot/reset, journey, category, step)
- Auth callback URL helpers (`authUrls`)

Not covered yet (deferred): real email confirm/reset links end-to-end.

```bash
npm test
```

### E2E (Playwright)

**Public smoke** (always):

- `/` home
- `/tarot` library hub
- `/tarot/cards`
- `/auth` + `/auth?mode=forgot`
- `/en/tarot` locale prefix
- Guest redirect from `/my-journeys` and `/profile` → `/auth?next=...`

**Authenticated** (optional — skipped in CI without secrets): set in `.env.local`:

```bash
E2E_USER_EMAIL=your-test-user@example.com
E2E_USER_PASSWORD=...
```

Uses a real Supabase login against local `.env.local` keys. Skipped when those vars are missing (CI stays green without secrets).

Happy path when credentials are set:

1. `npm run dev` (or let Playwright start it)
2. `npm run test:e2e` (or only `e2e/auth.spec.ts`)
3. Expect: login → `/en/my-journeys` → `/en/profile` → `/en/categories` manage heading

Do not put `E2E_USER_*` in GitHub Actions secrets unless you intentionally want paid CI against a live project.

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
2. Playwright (public smoke + guest redirect; auth suite skipped without secrets)

### Current status (local)

| Suite | Result |
|-------|--------|
| Vitest unit | credits, AI schema, `askAI`, API 401 guards, forms, tarot helpers |
| Playwright | public smoke + guest redirect; auth+categories when `E2E_USER_*` set |
| ESLint | 0 errors (1 known RHF `watch` warning) |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright](https://playwright.dev)
- [Vitest](https://vitest.dev)
