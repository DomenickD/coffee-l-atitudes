import React from "react";
import { Clock, Coffee, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Café Menu & Local Pick-Up | Coffee Latitudes",
  description:
    "Order handcrafted espresso drinks, single-origin Kona pour-overs, and 18-hour cold brew for fast café pick-up.",
};

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: { category: { slug: "cafe-menu" } },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-20">
      {/* Page Banner */}
      <section
        id="pickup"
        className="bg-espresso-950 py-16 text-crema-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-crema-300">
            Order Here • Pick-Up Bar
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Café Menu &amp; Local Pick-Up
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-crema-200/85">
            Every espresso shot is dialed in each morning on our Jinotega
            black-honey lot, and single-origin pour-overs are hand-brewed to
            order. Skip the line and grab your drink warm at the brick counter.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-crema-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <Clock className="h-4 w-4 text-crema-300" />
              Ready in ~8–12 minutes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <Coffee className="h-4 w-4 text-crema-300" />
              Organic whole &amp; oat milk available
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <MapPin className="h-4 w-4 text-crema-300" />
              Pick-Up Window Open Daily 7am – 4pm
            </span>
          </div>
        </div>
      </section>

      {/* Café Menu Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
