# Coffee Latitudes (`coffeelatitudes.com`)

Direct-trade specialty coffee storefront, café pick-up bar, and farm-to-cup traceability experience built with **Next.js 15**, **PostgreSQL + Prisma**, **Stripe**, **Resend**, and **Railway**.

## Key Features
- **Interactive Brick-Wall Hero (`BrickWallHero`)**: Plays `/media/brick-hero.mp4` (or renders a high-contrast architectural brick-wall fallback stage) with 5 time-synced storefront hotspots across a 10-second loop (`0–2s` Pick-Up, `2–4s` Café Menu, `4–6s` Bagged Coffee, `6–8s` Merch, `8–10s` Learn About Us).
- **Coordinate Calibration Mode (`/?calibrate=1`)**: Drag-and-drop hotspot positioning with timeline scrubber and copyable JSON coordinates for `src/lib/hotspots.ts`.
- **Ambient Sensory Audio Toggle**: Plays `/media/ambient-cafe.mp3` when present or synthesizes warm café/rainforest pink-noise ambiance via Web Audio API.
- **Server-Side Verified Checkout**: `/api/checkout` validates products, weight/grind/size options, and recalculates totals authoritatively from PostgreSQL—never trusting client totals. Supports Stripe Checkout and `MOCK_STRIPE=true` mode for zero-key testing.
- **Origin Traceability**: Live farm-lot ledger (`FarmLot`) for North Kona (Hawaii), Wahgi Valley (Papua New Guinea), and Jinotega (Nicaragua).

## Quick Start (Local Preview)
Run one command (starts local embedded PostgreSQL, applies migrations, seeds products, launches Next.js, and opens `http://localhost:3000` in your browser):
```bash
npm run preview
```
Or run `./start-preview.sh` in Bash (Git Bash / WSL / macOS / Linux). Press `Ctrl+C` to stop both Next.js and PostgreSQL cleanly.

<details>
<summary>Manual two-terminal setup</summary>

```bash
npm install
cp .env.example .env

# Terminal 1: Start local embedded PostgreSQL (no Docker required)
npx tsx scripts/local-pg.ts

# Terminal 2: Migrate, seed, and run Next.js
npx prisma migrate deploy
npx prisma db seed
npm run dev
```
</details>

## 4-Gate Quality Control Suite
```bash
# Gate 1: TypeScript & ESLint
npx tsc --noEmit && npm run lint

# Gate 2: Prisma Schema, Migrations & Seed
npx prisma validate && npx prisma migrate deploy && npx prisma db seed

# Gate 3: Unit & API Integration Tests (Vitest)
npm run test:unit

# Gate 4: Desktop (1440x900) & Mobile (390x844) E2E Tests (Playwright)
npm run build && npm run test:e2e
```

## Railway Deployment
See [`plan.md`](./plan.md) and [`HANDOFF_STATE.md`](./HANDOFF_STATE.md) for the complete Railway provisioning, environment variables, and custom domain checklist.
