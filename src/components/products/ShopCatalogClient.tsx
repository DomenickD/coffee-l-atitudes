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
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category.slug === activeCategory);
  }, [products, activeCategory]);

  const tabs = [
    { slug: "all", label: "All Offerings" },
    { slug: "bagged-coffee", label: "Bagged Coffee" },
    { slug: "merch", label: "Merch" },
  ];

  return (
    <div>
      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Shop categories"
        className="mb-10 flex flex-wrap items-center gap-2"
      >
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-testid={`shop-tab-${tab.slug}`}
              onClick={() => setActiveCategory(tab.slug)}
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

      {/* Product Grid */}
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
