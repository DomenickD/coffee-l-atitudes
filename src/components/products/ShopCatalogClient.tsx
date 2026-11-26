"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, ProductCardData } from "./ProductCard";

interface ShopCatalogClientProps {
  products: ProductCardData[];
}

export function ShopCatalogClient({ products }: ShopCatalogClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialRoast = searchParams.get("roast") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeRoast, setActiveRoast] = useState<string>(initialRoast);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category.slug !== activeCategory) {
        return false;
      }
      if (activeRoast !== "all") {
        const level = (p.roastLevel || "").toLowerCase();
        if (!level.includes(activeRoast.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [products, activeCategory, activeRoast]);

  const categoryTabs = [
    { slug: "all", label: "All Offerings" },
    { slug: "bagged-coffee", label: "Bagged Coffee" },
    { slug: "merch", label: "Merch & Brewing Gear" },
  ];

  const roastTabs = [
    { slug: "all", label: "All Roasts" },
    { slug: "light", label: "Light Roast" },
    { slug: "medium", label: "Medium Roast" },
    { slug: "dark", label: "Dark Roast" },
    { slug: "decaf", label: "Decaf" },
  ];

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Shop categories"
          className="flex flex-wrap items-center gap-2"
        >
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`shop-tab-${tab.slug}`}
                onClick={() => {
                  setActiveCategory(tab.slug);
                  if (tab.slug === "merch") setActiveRoast("all");
                }}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition ${
                  isActive
                    ? "bg-espresso-950 text-crema-50 shadow-sm"
                    : "border border-crema-300 bg-white text-espresso-800 hover:border-espresso-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Roast Level Sub-Filter */}
        {activeCategory !== "merch" && (
          <div
            aria-label="Filter by roast level"
            className="flex flex-wrap items-center gap-1.5"
          >
            {roastTabs.map((roast) => {
              const isActive =
                activeRoast.toLowerCase() === roast.slug.toLowerCase();
              return (
                <button
                  key={roast.slug}
                  type="button"
                  data-testid={`roast-tab-${roast.slug}`}
                  onClick={() => {
                    setActiveRoast(roast.slug);
                    if (roast.slug !== "all" && activeCategory === "all") {
                      setActiveCategory("bagged-coffee");
                    }
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-terracotta-600 text-white"
                      : "bg-crema-100 text-espresso-800 hover:bg-crema-200"
                  }`}
                >
                  {roast.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-crema-200 bg-white py-16 text-center">
          <p className="font-serif text-lg text-espresso-900">
            No products match this filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setActiveRoast("all");
            }}
            className="mt-4 rounded-full bg-espresso-950 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-crema-50"
          >
            Show All Offerings
          </button>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
