import React, { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  Compass,
  Flame,
  Package,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BrickWallHero } from "@/components/hero/BrickWallHero";
import { LotTrackerCard } from "@/components/traceability/LotTrackerCard";
import { ProductCard } from "@/components/products/ProductCard";
import { WholesaleInquiryForm } from "@/components/home/WholesaleInquiryForm";

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

  const roastLevels = [
    {
      slug: "light",
      title: "Light Roast",
      subtitle: "Bright, floral & origin-forward",
      description:
        "Delicate aromatics, citrus clarity, and vibrant fruit notes—like Flower Power Blend, Ethiopia Sidamo-Guji, and Estate Kona.",
      icon: Sun,
      gradient: "from-amber-900/90 via-terracotta-600/85 to-crema-500/80",
    },
    {
      slug: "medium",
      title: "Medium Roast",
      subtitle: "Balanced sweetness & silky body",
      description:
        "Caramelized honey sweetness with roasted hazelnut and cocoa balance—showcasing Nicaragua Jinotega and Papua New Guinea.",
      icon: Flame,
      gradient: "from-espresso-800 via-espresso-700 to-terracotta-600/90",
    },
    {
      slug: "dark",
      title: "Dark Roast",
      subtitle: "Bold, smoky & syrupy espresso",
      description:
        "Deep bittersweet cacao, molasses richness, and heavy crema—featuring El-Jefe Espresso, Tarrazú Dark, and Honduras After Dark FTO.",
      icon: Moon,
      gradient: "from-espresso-950 via-espresso-900 to-espresso-800",
    },
  ];

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

      {/* Be Bold, Be Light, Be What You Want — Signature Coffee Latitudes Statement */}
      <section className="border-b border-crema-200 bg-crema-100/75">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta-600">
            Celebrate the Moment It Hits Your Lips • Tampa, FL
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-espresso-950 sm:text-5xl">
            Be Bold, Be Light, Be What You Want
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-espresso-800">
            The best beans mean the best coffee. Founded by James Frank with
            over 30 years in specialty coffee, Coffee Latitudes curates and
            roasts artisanal coffees from across the Bean Belt—whether you crave
            bold dark espresso, bright floral light roasts, or smooth
            chemical-free decaf.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop?category=bagged-coffee"
              className="inline-flex items-center gap-2 rounded-full bg-espresso-950 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
            >
              Shop All Coffee
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-espresso-900 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-espresso-950 hover:text-crema-50"
            >
              Visit Tampa Café Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Roast Level */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-canopy-700">
              Roasted Fresh in Small Batches
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-espresso-950 sm:text-4xl">
              Shop by Roast Level
            </h2>
          </div>
          <Link
            href="/shop?category=bagged-coffee&roast=decaf"
            className="text-xs font-semibold uppercase tracking-widest text-terracotta-600 hover:text-espresso-950"
          >
            Looking for Decaf? Browse Peruvian Decaf →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {roastLevels.map((roast) => {
            const Icon = roast.icon;
            return (
              <Link
                key={roast.slug}
                href={`/shop?category=bagged-coffee&roast=${roast.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${roast.gradient} p-8 text-crema-50 shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-crema-200" />
                  </span>
                  <ArrowRight className="h-5 w-5 text-crema-200/75 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-crema-200/80">
                  {roast.subtitle}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-semibold text-white">
                  {roast.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-crema-100/85">
                  {roast.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Offerings (Roastery & Café Bar) */}
      <section className="border-y border-crema-200 bg-crema-100/50 py-20">
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
                Order fresh Tampa café drinks &amp; bites for local pick-up or
                have custom-ground whole beans, subscriptions, and gear shipped
                from our roaster.
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
                Shop All Beans &amp; Gear
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

      {/* Brewers, Grinders & Subscriptions Spotlight (from coffeelatitudes.com) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl border border-crema-200 bg-white p-8 shadow-sm sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-crema-100 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-espresso-800">
                <Coffee className="h-3.5 w-3.5 text-terracotta-600" />
                Home Barista Essentials
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-espresso-950">
                Brewers, Grinders &amp; Accessories
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-espresso-800 sm:text-base">
                Everything you need to brew an extraordinary cup at home—Hario
                Buono gooseneck kettles, Chemex pour-over carafes, French
                presses, 15oz CL logo mugs, and roastery headwear.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/shop?category=merch"
                className="inline-flex items-center gap-2 rounded-full bg-espresso-950 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
              >
                <Package className="h-4 w-4" />
                Shop Merchandise &amp; Gear
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-canopy-900 p-8 text-crema-50 shadow-sm sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-crema-200">
                <RefreshCw className="h-3.5 w-3.5 text-crema-300" />
                Biweekly &amp; Monthly Boxes
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-white">
                Coffee Subscriptions
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-crema-200/90 sm:text-base">
                Never run out of freshly roasted coffee again. Pick whole bean
                or your preferred grind and receive James&apos;s curated
                single-origin selections and roaster favorites on your schedule.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/shop?category=bagged-coffee"
                className="inline-flex items-center gap-2 rounded-full bg-crema-50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-crema-200"
              >
                <Sparkles className="h-4 w-4" />
                Explore Subscription Boxes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Origin & Farm-to-Cup Traceability Story Section */}
      <section className="border-t border-crema-200 bg-crema-100/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-canopy-700">
                <Compass className="h-4 w-4" />
                Farm-to-Cup Traceability
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-espresso-950 sm:text-4xl">
                Current Harvest Lots Across the Bean Belt
              </h2>
              <p className="mt-3 text-base leading-relaxed text-espresso-800">
                We love sharing the provenance of our coffees and the stories of
                the families who farm them—publishing lot codes, elevations,
                cupping scores, and direct farm-gate premiums.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 self-start rounded-full border border-espresso-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-espresso-950 hover:text-crema-50 md:self-auto"
            >
              Our Story &amp; Origins
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {farmLots.map((lot) => (
              <LotTrackerCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>
      </section>

      {/* Tampa Wholesale: Churches, Offices & Food Trucks */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <WholesaleInquiryForm />
      </section>
    </>
  );
}
