"use client";

import React, { useState } from "react";
import { Check, Plus, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { computeUnitPriceCents, formatCurrency } from "@/lib/pricing";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  badge: string | null;
  origin: string | null;
  roastLevel: string | null;
  tastingNotes: string[];
  weightOptions: string[];
  grindOptions: string[];
  sizeOptions: string[];
  category: {
    slug: string;
    name: string;
  };
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<string | null>(
    product.weightOptions[0] ?? null
  );
  const [selectedGrind, setSelectedGrind] = useState<string | null>(
    product.grindOptions[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizeOptions[0] ?? null
  );
  const [justAdded, setJustAdded] = useState(false);

  const unitPriceCents = computeUnitPriceCents(
    product.priceCents,
    selectedWeight
  );

  function handleAddToCart() {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      categorySlug: product.category.slug,
      imageUrl: product.imageUrl,
      basePriceCents: product.priceCents,
      quantity: 1,
      weightOption: selectedWeight,
      grindOption: selectedGrind,
      sizeOption: selectedSize,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article
      data-testid={`product-card-${product.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-crema-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-52 overflow-hidden bg-espresso-900">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.badge && (
          <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-espresso-950/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-crema-200 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-crema-300" />
            {product.badge}
          </span>
        )}
        {product.roastLevel && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-espresso-900">
            {product.roastLevel} Roast
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {product.origin && (
              <p className="font-mono text-[11px] uppercase tracking-wider text-canopy-700">
                {product.origin}
              </p>
            )}
            <h3 className="mt-0.5 font-serif text-lg font-semibold leading-snug text-espresso-950">
              {product.name}
            </h3>
          </div>
          <span
            data-testid={`product-price-${product.slug}`}
            className="whitespace-nowrap font-serif text-lg font-semibold text-espresso-950"
          >
            {formatCurrency(unitPriceCents)}
          </span>
        </div>

        <p className="mt-1 text-xs font-medium text-espresso-700">
          {product.subtitle}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-espresso-800">
          {product.description}
        </p>

        {product.tastingNotes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tastingNotes.map((note) => (
              <span
                key={note}
                className="rounded-full bg-crema-100 px-2.5 py-0.5 text-[11px] font-medium text-espresso-800"
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Interactive Selectors */}
        <div className="mt-auto space-y-3 pt-5">
          {product.weightOptions.length > 0 && (
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-700">
                Bag Weight
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    aria-pressed={selectedWeight === weight}
                    data-testid={`weight-${product.slug}-${weight}`}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                      selectedWeight === weight
                        ? "border-espresso-950 bg-espresso-950 text-crema-50"
                        : "border-crema-300 bg-crema-50 text-espresso-800 hover:border-espresso-700"
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.grindOptions.length > 0 && (
            <div>
              <label
                htmlFor={`grind-${product.slug}`}
                className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-700"
              >
                Grind Style
              </label>
              <select
                id={`grind-${product.slug}`}
                data-testid={`grind-select-${product.slug}`}
                value={selectedGrind ?? ""}
                onChange={(e) => setSelectedGrind(e.target.value)}
                className="mt-1 w-full rounded-lg border border-crema-300 bg-crema-50 px-3 py-2 text-xs font-medium text-espresso-950 focus:border-canopy-700 focus:outline-none focus:ring-1 focus:ring-canopy-700"
              >
                {product.grindOptions.map((grind) => (
                  <option key={grind} value={grind}>
                    {grind}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.sizeOptions.length > 0 && (
            <div>
              <label
                htmlFor={`size-${product.slug}`}
                className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-700"
              >
                Option / Size
              </label>
              <select
                id={`size-${product.slug}`}
                data-testid={`size-select-${product.slug}`}
                value={selectedSize ?? ""}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-1 w-full rounded-lg border border-crema-300 bg-crema-50 px-3 py-2 text-xs font-medium text-espresso-950 focus:border-canopy-700 focus:outline-none focus:ring-1 focus:ring-canopy-700"
              >
                {product.sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            data-testid={`add-to-cart-${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added to Bag
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Bag • {formatCurrency(unitPriceCents)}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
