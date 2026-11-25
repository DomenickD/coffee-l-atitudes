# COFFEE LATITUDES (coffeelatitudes.com) — RAILWAY EXECUTION PLAN

## 1. PROJECT OVERVIEW & BRAND VISION
- **Client / Brand**: Coffee Latitudes (`https://coffeelatitudes.com`)
- **Contacts / Stakeholders**: James Frank (`james@coffeelatitudes.com`) & Julio Figueroa (`juliofig89@gmail.com`)
- **Core Interactive Concept**:
  - Full-viewport atmospheric hero featuring a 10-second loopable brick-wall background video of James pointing at five interactive, time-synced storefront hotspots:
    1. Order Here / Pick-Up Here (`0.0s - 2.0s`)
    2. Café Menu (`2.0s - 4.0s`)
    3. Bagged Coffee (`4.0s - 6.0s`)
    4. Merch (`6.0s - 8.0s`)
    5. Learn About Us (`8.0s - 10.0s`)
  - Inspired by Gold Mountain Coffee Growers: transparent header with white outline wordmark/logo, minimal top navigation (`HOME`, `MENU`, `SHOP`, `ABOUT`, `CONTACT`), optional ambient café/rainforest sensory audio toggle, and story-first origin & farm-to-cup traceability sections.

## 2. TECH STACK & RAILWAY ARCHITECTURE
- **Framework**: Next.js 15 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS + Lucide Icons + Framer Motion
- **Database & ORM**: PostgreSQL (Railway managed Postgres) + Prisma ORM
- **Payments**: Stripe Checkout (with `MOCK_STRIPE=true` fallback for zero-key local/CI testing)
- **Transactional Email**: Resend (`orders@coffeelatitudes.com`) with console log fallback
- **Deployment Target**: Railway (`Dockerfile` with standalone Next.js output, `railway.toml`, healthcheck at `/api/health`, custom domain `coffeelatitudes.com`)

## 3. REPOSITORY STRUCTURE
```text
coffeelatitudes/
├── prisma/
│   ├── schema.prisma          # Product, Category, Order, OrderItem, FarmLot, Subscriber
│   └── seed.ts                # Seeds Café Menu, Bagged Coffee (Kona, PNG, Nicaragua), Merch, Traceability Lots
├── public/
│   ├── media/                 # Placeholder/fallback brick wall loop + ambient audio fallback
│   └── images/                # Origin photography & product placeholders
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Transparent sticky nav, CartDrawer provider, AmbientAudioToggle
│   │   ├── page.tsx           # Full-screen BrickWallHero + TraceabilityStory + FeaturedOfferings
│   │   ├── menu/page.tsx      # Café Menu & local Pick-Up ordering
│   │   ├── shop/page.tsx      # Bagged Coffee (grind/weight selectors) & Merch
│   │   ├── about/page.tsx     # Origin story, farm traceability lots, roasting philosophy
│   │   ├── checkout/success/page.tsx
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── products/route.ts
│   │       ├── checkout/route.ts          # Server-side price calculation + Stripe / Mock Checkout
│   │       ├── subscribe/route.ts
│   │       └── webhooks/stripe/route.ts
│   ├── components/
│   │   ├── hero/BrickWallHero.tsx         # Video + time-synced hotspots + ?calibrate=1 coordinate inspector
│   │   ├── audio/AmbientAudioToggle.tsx   # MP3 player with Web Audio API procedural café ambiance fallback
│   │   ├── cart/CartDrawer.tsx
│   │   └── traceability/LotTrackerCard.tsx
│   └── lib/
│       ├── prisma.ts
│       ├── stripe.ts
│       └── hotspots.ts                    # Configurable hotspot timestamps & x/y percentages
├── tests/
│   ├── unit/checkout.test.ts              # Vitest server-side pricing & validation tests
│   └── e2e/storefront.spec.ts             # Playwright desktop + mobile E2E suite
├── railway.toml                           # Build, start (prisma migrate deploy && server), and /api/health config
├── Dockerfile                             # Multi-stage production build for Railway
└── HANDOFF_STATE.md                       # Cross-agent checkpoint tracker
```

## 4. KEY FEATURES & RESILIENCE FALLBACKS
- **BrickWallHero & Coordinate Calibration Mode (`?calibrate=1`)**:
  - Plays `/media/brick-hero.mp4` (`muted`, `autoPlay`, `loop`, `playsInline`). If the video file is missing, renders a high-contrast exposed-brick CSS/SVG fallback stage so layout and hotspot timing still work identically.
  - Time-syncs active pulse states on the 5 buttons to video `currentTime` (`0-10s`).
  - Visiting `/?calibrate=1` unlocks drag-and-drop hotspot positioning and outputs exact JSON coordinates to copy into `src/lib/hotspots.ts` once James records his 10-second video.
- **Ambient Sensory Audio Toggle**:
  - Plays `/media/ambient-cafe.mp3` if present, or synthesizes warm café/rainforest pink-noise ambiance via Web Audio API so zero external audio assets are required to pass tests.
- **Server-Side Price Verification & Checkout**:
  - `/api/checkout` validates all cart items against PostgreSQL prices (never trusting client totals), creates a pending `Order`, and redirects to Stripe Checkout (or `/checkout/success?mock=1` when `MOCK_STRIPE=true`).

## 5. 4-GATE QUALITY CONTROL (QC) SUITE
1. **Gate 1 (Static & Type Safety)**: `npx tsc --noEmit && npm run lint`
2. **Gate 2 (Database Integrity)**: `npx prisma validate && npx prisma migrate deploy && npx prisma db seed`
3. **Gate 3 (Unit & API Tests - Vitest)**: Verify server-side price recalculation, invalid product rejection, and `/api/health` 200 OK response.
4. **Gate 4 (End-to-End Browser Tests - Playwright, Desktop 1440x900 & Mobile 390x844)**:
   - Hero renders with all 5 hotspot buttons visible and clickable.
   - `?calibrate=1` mode toggles calibration overlay cleanly.
   - Adding Café Menu item + Bagged Coffee (with grind option) updates `CartDrawer` subtotal accurately.
   - Completing mock checkout persists an `Order` record in Postgres and renders confirmation.

## 6. CROSS-AGENT HANDOFF PROTOCOL (`HANDOFF_STATE.md`)
Maintain `HANDOFF_STATE.md` at the repository root after every major step:
- Track completed vs. remaining checklist items, current test gate status, and any environment variables set.
- Handoff Resume Prompt for Claude Code / Codex:
  > "Read plan.md and HANDOFF_STATE.md. Inspect the current workspace and git status, verify which of the 4 QC gates currently pass, and execute the remaining unchecked tasks in order until all 4 QC gates pass cleanly."

## 7. RAILWAY DEPLOYMENT CHECKLIST
1. Create Railway project and provision PostgreSQL service.
2. Set environment variables: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL=https://coffeelatitudes.com`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MOCK_STRIPE=false` (once live keys are added), `RESEND_API_KEY`.
3. Deploy via GitHub or `railway up` (`railway.toml` runs `prisma migrate deploy` automatically on startup).
4. Attach custom domain `coffeelatitudes.com` in Railway Settings -> Networking and configure DNS records.
