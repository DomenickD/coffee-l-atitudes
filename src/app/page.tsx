import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Flame, Sprout } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BrickWallHero } from "@/components/hero/BrickWallHero";
import { LotTrackerCard } from "@/components/traceability/LotTrackerCard";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [farmLots, featuredProducts] = await Promise.all([
    prisma.farmLot.findMany({
      orderBy: { cupScore: "desc" },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      take: 6,
    }),
  ]);

  return (
    <>
      {/* Full-Viewport Time-Synced Brick Wall Hero */}
      <Suspense
        fallback={
          <div className="brick-wall-fallback min-h-[100svh] w-full bg-espresso-950" />
        }
      >
        <BrickWallHero />
      </Suspense>

      {/* Brand Pillars Strip */}
      <section className="border-b border-crema-200 bg-crema-100/70">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-canopy-800 p-3 text-crema-100">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-950">
                100% Latitude Traceability
              </h2>
              <p className="mt-1 text-sm text-espresso-800">
                Every harvest carries GPS coordinates, farm-gate premiums, and
                cupping scores direct from our partner growers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-terracotta-600 p-3 text-crema-50">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-950">
                Roasted in Small Batches
              </h2>
              <p className="mt-1 text-sm text-espresso-800">
                Profiled lightly to preserve volcanic terroir, floral aromatics,
                and natural honey sweetness—never scorched.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-espresso-900 p-3 text-crema-200">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-espresso-950">
                Shade-Grown Stewardship
              </h2>
              <p className="mt-1 text-sm text-espresso-800">
                Direct relationships with smallholder cooperatives protecting
                cloud-forest biodiversity and clean water.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin & Farm-to-Cup Traceability Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-canopy-700">
              Farm-to-Cup Traceability
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-espresso-950 sm:text-4xl">
              Current Harvest Lots Across the Coffee Belt
            </h2>
            <p className="mt-3 text-base leading-relaxed text-espresso-800">
              Inspired by farmer-first growers across the tropics, we publish
              exact lot codes, elevations, and direct-trade premiums for every
              single origin we roast.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 self-start rounded-full border border-espresso-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-espresso-950 hover:text-crema-50 md:self-auto"
          >
            Explore Our Origins
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {farmLots.map((lot) => (
            <LotTrackerCard key={lot.id} lot={lot} />
          ))}
        </div>
      </section>

      {/* Featured Offerings */}
      <section className="border-t border-crema-200 bg-crema-100/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-terracotta-600">
                Roastery &amp; Bar Selections
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-espresso-950 sm:text-4xl">
                Featured Offerings
              </h2>
              <p className="mt-3 text-base text-espresso-800">
                Order fresh café drinks for local pick-up or have whole-bean and
                custom-ground micro-lots shipped straight from our roaster.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-espresso-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
              >
                Café Menu
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-espresso-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-espresso-950 hover:text-crema-50"
              >
                Shop All Beans &amp; Merch
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
