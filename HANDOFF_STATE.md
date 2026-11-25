# HANDOFF_STATE.md — Coffee Latitudes

Last Updated: 2026-11-25
Executing Agent: Antigravity
Target Domain: `https://coffeelatitudes.com`

## 1. Execution Checklist
- [x] Save Railway execution plan (`plan.md`)
- [x] Initialize Next.js 15 (App Router, TypeScript, React 19) + Tailwind CSS + Lucide + Framer Motion
- [x] Define Prisma PostgreSQL schema (`Category`, `FarmLot`, `Product`, `Order`, `OrderItem`, `Subscriber`) and initial SQL migration (`prisma/migrations/20261125000000_init`)
- [x] Implement idempotent database seed (`prisma/seed.ts`) for Café Menu, Bagged Coffee (Kona, Papua New Guinea, Nicaragua), Merch, and Traceability Farm Lots
- [x] Implement core server utilities (`src/lib/prisma.ts`, `src/lib/hotspots.ts`, `src/lib/pricing.ts`, `src/lib/stripe.ts`, `src/lib/email.ts`)
- [x] Implement API routes (`/api/health`, `/api/products`, `/api/checkout`, `/api/webhooks/stripe`, `/api/subscribe`)
- [x] Build Gold-Mountain-inspired transparent sticky header (`Navbar`), `BrickWallHero` with 5 time-synced hotspots + architectural brick-wall fallback + `?calibrate=1` drag-and-drop coordinate inspector
- [x] Build `AmbientAudioToggle` with `/media/ambient-cafe.mp3` detection and Web Audio API procedural café/rainforest fallback
- [x] Build `CartContext`, `CartDrawer`, `ProductCard` (weight/grind/size selectors), `ShopCatalogClient`, `LotTrackerCard`, and `Footer`
- [x] Build App Router pages (`/`, `/menu`, `/shop`, `/about`, `/checkout/success`)
- [x] Generate editorial SVG imagery in `public/images/` and media drop-in guide in `public/media/README.md`
- [x] Add Vitest unit & API integration tests (`tests/unit/checkout.test.ts`)
- [x] Add Playwright E2E tests for Desktop `1440x900` and Mobile `390x844` (`tests/e2e/storefront.spec.ts`)
- [x] Add Railway deployment files (`Dockerfile`, `.dockerignore`, `railway.toml`)
- [ ] Drop in production media files (`public/media/brick-hero.mp4` and optional `public/media/ambient-cafe.mp3`) once James records the 10-second brick-wall video, then calibrate coordinates via `/?calibrate=1`
- [ ] Authenticate Railway CLI (`railway login`), provision Railway project + PostgreSQL service, set production environment variables, deploy, and attach `coffeelatitudes.com`

## 2. 4-Gate Quality Control (QC) Status

| Gate | Command | Status | Notes |
| --- | --- | --- | --- |
| **Gate 1 (Static & Type Safety)** | `npx tsc --noEmit && npm run lint` | **PASS** | 0 TypeScript errors, 0 ESLint errors |
| **Gate 2 (Database Integrity)** | `npx prisma validate && npx prisma migrate deploy && npx prisma db seed` | **PASS** | Validated schema, applied `20261125000000_init`, seeded 3 categories, 3 farm lots, 10 products |
| **Gate 3 (Unit & API Tests - Vitest)** | `npm run test:unit` | **PASS** | 7/7 tests passed (server-side pricing recalculation, spoofed-total rejection, invalid product rejection, `/api/health` 200 OK, Postgres Order persistence) |
| **Gate 4 (E2E - Playwright)** | `npm run test:e2e` | **PASS** | 6/6 tests passed across `desktop-1440x900` and `mobile-390x844` (5 hero hotspots, `?calibrate=1`, Café Menu + Bagged Coffee grind subtotal `$25.75`, mock checkout persisted to Postgres & confirmation rendered) |
| **Production Build** | `npm run build` | **PASS** | Next.js 15 standalone build succeeded cleanly |

## 3. Environment Variables

Local `.env` (gitignored; template in `.env.example`):
- `DATABASE_URL` — PostgreSQL connection string (`postgresql://postgres:postgres@127.0.0.1:5432/coffeelatitudes?schema=public` for local embedded Postgres via `npx tsx scripts/local-pg.ts`)
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally; `https://coffeelatitudes.com` in Railway production
- `MOCK_STRIPE` — `"true"` locally/CI; set to `"false"` once live Stripe keys are configured on Railway
- `STRIPE_SECRET_KEY` — Live/test Stripe secret key (empty in mock mode)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret for `/api/webhooks/stripe`
- `RESEND_API_KEY` — Resend API key (falls back to structured console logging when unset)
- `EMAIL_FROM` — `orders@coffeelatitudes.com`

## 4. Local Development & Testing Notes
- If Docker is not running locally, start the bundled local PostgreSQL 17 instance with:
  ```bash
  npx tsx scripts/local-pg.ts
  ```
- Then run migrations, seed, and the QC gates:
  ```bash
  npx prisma migrate deploy && npx prisma db seed
  npx tsc --noEmit && npm run lint
  npm run test:unit
  npm run build && npm run test:e2e
  ```

## 5. Railway Deployment Next Steps
1. Run `railway login` (local CLI OAuth token was expired during preflight).
2. Create or link the Railway project (`railway init --name coffee-latitudes`) and provision PostgreSQL (`railway add --database postgres`).
3. Configure production environment variables (`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL=https://coffeelatitudes.com`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MOCK_STRIPE=false`, `RESEND_API_KEY`).
4. Deploy (`railway up` or connect GitHub repo). `railway.toml` builds via `Dockerfile`, runs `prisma migrate deploy && node server.js`, and verifies `/api/health`.
5. Run `railway run npx prisma db seed` once after initial deployment to seed the production catalog and farm traceability lots.
6. Attach custom domain `coffeelatitudes.com` in Railway Settings -> Networking and configure DNS records.

## 6. Cross-Agent Handoff Resume Prompt
> Read `plan.md` and `HANDOFF_STATE.md`. Inspect the current workspace and git status, verify which of the 4 QC gates currently pass, and execute the remaining unchecked tasks in order until all 4 QC gates pass cleanly.
