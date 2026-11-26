import React from "react";
import Link from "next/link";
import {
  Clock,
  Compass,
  Flame,
  Globe2,
  HeartHandshake,
  MapPin,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LotTrackerCard } from "@/components/traceability/LotTrackerCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us — From Our Family to Yours | Coffee Latitudes",
  description:
    "Over 30 years of specialty coffee roasting craftsmanship by founder James Frank in Tampa, FL. Explore our cupping philosophy and farm-to-cup traceability lots.",
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
            From Our Family to Yours • Tampa, Florida
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            30+ Years of Coffee Craftsmanship Across the Bean Belt
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-crema-200/90">
            Coffee Latitudes is the culmination of founder James Frank&apos;s
            three decades in the coffee industry—built alongside his wife Olga
            as a welcoming Tampa neighborhood café and specialty micro-roastery.
            Every single origin is cupped and profiled to highlight its natural
            character before a single bag ever hits the shelf.
          </p>
        </div>
      </section>

      {/* Quality Craftsmanship & Visit Tampa Café */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-terracotta-600">
              Quality Craftsmanship
            </p>
            <h2 className="font-serif text-3xl font-semibold text-espresso-950">
              Making Artisanal Coffee Approachable &amp; Unforgettable
            </h2>
            <p className="text-base leading-relaxed text-espresso-800">
              James started out delivering bags of fresh-roasted coffee to local
              businesses, always happiest when talking shop about the subtle
              dark-chocolate undertones tucked deep inside a cup of Sumatra or a
              bright Central American micro-lot.
            </p>
            <p className="text-base leading-relaxed text-espresso-800">
              Altitude, volcanic soil, harvest processing, roast temperature,
              grind size, and even your brewing water all leave a fingerprint in
              the cup. Our mission is to guide you through the Bean Belt—giving
              you the transparency and confidence to discover the exact roast
              and origin you love most.
            </p>
          </div>

          <div className="rounded-3xl border border-crema-200 bg-crema-100/80 p-8 lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-canopy-700">
              Visit Our Tampa Roastery &amp; Café
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-espresso-950">
              New Tampa / County Line Rd
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-espresso-800">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-terracotta-600" />
                <span>
                  6431 E. County Line Rd., Unit #110
                  <br />
                  Tampa, FL 33647
                  <br />
                  <span className="text-xs text-espresso-600">
                    West of Bruce B. Downs Blvd.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-canopy-700" />
                <span>
                  Mon – Fri: 7:00 AM – 6:00 PM
                  <br />
                  Saturday: 8:00 AM – 5:00 PM
                  <br />
                  Sunday: 9:00 AM – 5:00 PM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-canopy-700" />
                <a
                  href="tel:+18135758000"
                  className="font-semibold text-espresso-950 hover:text-terracotta-600"
                >
                  (813) 575-8000
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex w-full items-center justify-center rounded-full bg-espresso-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
              >
                Order Local Pick-Up
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          <div className="rounded-2xl border border-crema-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-xl bg-canopy-800 p-3 text-crema-100">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-950">
              Direct Origin Partnerships
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso-800">
              We celebrate the families and cooperatives behind every harvest—
              from Nicaragua and Costa Rica to Ethiopia, Papua New Guinea, and
              North Kona estates.
            </p>
          </div>

          <div className="rounded-2xl border border-crema-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-xl bg-terracotta-600 p-3 text-crema-50">
              <Flame className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-espresso-950">
              Cupped &amp; Profiled In-House
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso-800">
              Every lot is test-roasted and cupped to find the exact time and
              temperature curve that unlocks its natural sweetness—whether
              light, medium, or dark.
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
              Every traceable micro-lot carries its harvest window, varietal
              lineage, elevation, washing method, and cupping score right on the
              page.
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
            Taste the Coffee Belt Fresh from Our Tampa Roaster
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-crema-200/85">
            Stop by County Line Rd. for a Cuban coffee and NY crumb cake, or
            order custom-ground bags delivered straight to your door.
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
