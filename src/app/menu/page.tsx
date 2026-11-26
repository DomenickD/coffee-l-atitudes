import React from "react";
import { Clock, Coffee, MapPin, Phone, Utensils } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tampa Café Menu & Local Pick-Up | Coffee Latitudes",
  description:
    "Order handcrafted espresso drinks, Tampa Cuban coffee, single-origin pour-overs, breakfast sandwiches, and house-made NY crumb cake at 6431 E. County Line Rd., Tampa.",
};

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: { category: { slug: "cafe-menu" } },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const drinks = products.filter((p) => p.origin === "Coffee Bar");
  const bites = products.filter((p) => p.origin !== "Coffee Bar");

  return (
    <div className="pt-20">
      {/* Page Banner */}
      <section id="pickup" className="bg-espresso-950 py-16 text-crema-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-crema-300">
            Tampa Neighborhood Café &amp; Roastery • Pick-Up Bar
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Café Menu &amp; Local Pick-Up
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-crema-200/85">
            House-roasted specialty espresso, authentic Tampa Cuban coffee,
            hand-poured single origins, hot breakfast sandwiches on imported NY
            bagels, signature lunch subs, and house-baked pastries.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs text-crema-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <MapPin className="h-4 w-4 text-crema-300" />
              6431 E. County Line Rd., Unit #110, Tampa, FL 33647
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
              <Clock className="h-4 w-4 text-crema-300" />
              Mon–Fri 7am–6pm • Sat 8am–5pm • Sun 9am–5pm
            </span>
            <a
              href="tel:+18135758000"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 transition hover:border-crema-300"
            >
              <Phone className="h-4 w-4 text-crema-300" />
              (813) 575-8000
            </a>
          </div>
        </div>
      </section>

      {/* Coffee & Espresso Bar */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-xl bg-espresso-950 p-2.5 text-crema-200">
            <Coffee className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-canopy-700">
              Pulled &amp; Brewed Fresh
            </p>
            <h2 className="font-serif text-2xl font-semibold text-espresso-950 sm:text-3xl">
              Coffee &amp; Specialty Beverages
            </h2>
          </div>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {drinks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Morning Bites, Sandwiches & Bakery */}
      {bites.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3 border-t border-crema-200 pt-12">
            <span className="rounded-xl bg-terracotta-600 p-2.5 text-crema-50">
              <Utensils className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta-600">
                Chef-Crafted Café Fare
              </p>
              <h2 className="font-serif text-2xl font-semibold text-espresso-950 sm:text-3xl">
                Morning Bites, Signature Sandwiches &amp; Bakery
              </h2>
            </div>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {bites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
