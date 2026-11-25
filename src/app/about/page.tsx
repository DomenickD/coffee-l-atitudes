import React from "react";
import Link from "next/link";
import { Compass, Flame, Globe2, HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LotTrackerCard } from "@/components/traceability/LotTrackerCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About & Origin Traceability | Coffee Latitudes",
  description:
    "Discover the Coffee Latitudes roasting philosophy, direct-trade farm partners in Kona, Papua New Guinea, and Nicaragua, and our transparent lot traceability.",
};

export default async function AboutPage() {
  const farmLots = await prisma.farmLot.findMany({
    orderBy: { cupScore: "desc" },
  });

  return (
    <div className="pt-20">
      {/* Editorial Story Header */}
      <section className="bg-espresso-950 py-20 text-crema-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-crema-300">
            Our Story • 23.5° N to 23.5° S
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Every Latitude Leaves a Fingerprint in the Cup
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-crema-200/90">
            Founded by James Frank alongside roastery partners and growers
            across the Pacific and Central America, Coffee Latitudes exists to
            bridge the distance between volcanic mountain farms and your morning
            ritual.
          </p>
        </div>
      </section>

      {/* Roasting Philosophy & Transparency */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="rounded-2xl border border-crema-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-xl bg-canopy-800 p-3 text-crema-100">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-950">
              Farmer-First Direct Trade
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso-800">
              We pay 42%–52% above commodity benchmarks directly at the farm
              gate, supporting women-led cooperatives in Jinotega, smallholder
              families in Papua New Guinea&apos;s Wahgi Valley, and heritage
              estates in North Kona.
            </p>
          </div>

          <div className="rounded-2xl border border-crema-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-xl bg-terracotta-600 p-3 text-crema-50">
              <Flame className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-950">
              Gentle, Precision Roasting
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso-800">
              Each micro-lot is cupped weekly and roasted in small cast-iron
              batches to accentuate sweetness, clarity, and origin terroir
              rather than roast bitterness.
            </p>
          </div>

          <div className="rounded-2xl border border-crema-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-xl bg-espresso-900 p-3 text-crema-200">
              <Globe2 className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-950">
              Open Lot Ledger
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso-800">
              Scan or look up any Coffee Latitudes lot code to see exact harvest
              window, varietal lineage, elevation, washing station method, and
              sensory score.
            </p>
          </div>
        </div>

        {/* Traceability Lots */}
        <div className="mt-20">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-canopy-700">
            <Compass className="h-4 w-4" />
            Verified Harvest Ledger
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso-950">
            Active Traceability Lots
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {farmLots.map((lot) => (
              <LotTrackerCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-3xl bg-canopy-900 px-8 py-12 text-center text-crema-50 sm:px-14">
          <h2 className="font-serif text-3xl font-semibold text-white">
            Taste the Coffee Belt Fresh from the Roaster
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-crema-200/85">
            Stop by for a hand-poured Kona V60 or order custom-ground micro-lot
            bags delivered straight to your door.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-crema-50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-crema-200"
            >
              Order Café Pick-Up
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-crema-300/60 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-white/10"
            >
              Shop Bagged Coffee
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
