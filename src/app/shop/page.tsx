import React, { Suspense } from "react";
import { Package, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ShopCatalogClient } from "@/components/products/ShopCatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Bagged Coffee & Merch | Coffee Latitudes",
  description:
    "Direct-trade bagged coffee from Hawaii Kona, Papua New Guinea, and Nicaragua with custom weight and grind selectors, plus small-batch roastery merch.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: { in: ["bagged-coffee", "merch"] },
      },
    },
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="pt-20">
      <section className="bg-espresso-950 py-16 text-crema-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-crema-300">
            Roasted to Order • Global Coffee Belt
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Bagged Coffee &amp; Roastery Merch
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-crema-200/85">
            Select your preferred bag size and custom grind—or keep it whole
            bean for maximum aroma. Every bag ships within 48 hours of roasting.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-crema-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <Package className="h-4 w-4 text-crema-300" />
              12oz, 16oz &amp; 2lb Roaster Bags
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-crema-300" />
              Direct Farm-Gate Traceability
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <Truck className="h-4 w-4 text-crema-300" />
              Roasted &amp; Dispatched Fresh
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-espresso-700">
              Loading roastery catalog...
            </div>
          }
        >
          <ShopCatalogClient products={products} />
        </Suspense>
      </section>
    </div>
  );
}
