"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  Lock,
} from "lucide-react";
import { useCart } from "./CartContext";
import { formatCurrency } from "@/lib/pricing";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    subtotalCents,
    taxCents,
    totalCents,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          pickupNotes: pickupNotes.trim() || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            weightOption: item.weightOption,
            grindOption: item.grindOption,
            sizeOption: item.sizeOption,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed. Please try again.");
      }

      clearCart();
      closeCart();

      if (typeof data.url === "string") {
        if (data.url.startsWith("http")) {
          window.location.href = data.url;
        } else {
          router.push(data.url);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete checkout."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      data-testid="cart-drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-crema-50 text-espresso-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-crema-200 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-terracotta-600" />
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              Your Order
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-espresso-700 transition hover:bg-crema-200/70 hover:text-espresso-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-16">
              <div className="mb-4 rounded-full bg-crema-200/60 p-4 text-espresso-700">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="font-serif text-lg font-medium text-espresso-900">
                Your bag is empty
              </p>
              <p className="mt-1 max-w-xs text-sm text-espresso-700">
                Explore our freshly pulled café drinks, direct-trade single-origin bags, and roastery merch.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-crema-200">
              {items.map((item) => {
                const variantTags = [
                  item.weightOption,
                  item.grindOption,
                  item.sizeOption,
                ].filter(Boolean);

                return (
                  <li
                    key={item.key}
                    className="flex gap-4 py-4"
                    data-testid="cart-item"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 flex-shrink-0 rounded-lg border border-crema-200 bg-espresso-900 object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-espresso-950">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-espresso-600 transition hover:text-terracotta-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {variantTags.length > 0 && (
                        <p className="mt-0.5 text-xs text-espresso-700">
                          {variantTags.join(" • ")}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-crema-300 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-espresso-700 hover:text-espresso-950"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-espresso-700 hover:text-espresso-950"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-espresso-950">
                          {formatCurrency(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Totals & Checkout Form */}
        {items.length > 0 && (
          <form
            onSubmit={handleCheckout}
            className="border-t border-crema-200 bg-crema-100/80 px-6 py-5 space-y-4"
          >
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-espresso-800">
                <span>Subtotal</span>
                <span
                  className="font-semibold text-espresso-950"
                  data-testid="cart-subtotal"
                >
                  {formatCurrency(subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between text-espresso-700">
                <span>Estimated Tax</span>
                <span data-testid="cart-tax">{formatCurrency(taxCents)}</span>
              </div>
              <div className="flex justify-between border-t border-crema-300/70 pt-2 text-base font-semibold text-espresso-950">
                <span>Total</span>
                <span data-testid="cart-total">
                  {formatCurrency(totalCents)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium uppercase tracking-wider text-espresso-700"
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  name="customerName"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="James Frank"
                  className="mt-1 w-full rounded-lg border border-crema-300 bg-white px-3 py-2 text-sm text-espresso-950 placeholder:text-espresso-600/50 focus:border-canopy-700 focus:outline-none focus:ring-1 focus:ring-canopy-700"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium uppercase tracking-wider text-espresso-700"
                >
                  Email for Receipt
                </label>
                <input
                  id="checkout-email"
                  name="customerEmail"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@coffeelatitudes.com"
                  className="mt-1 w-full rounded-lg border border-crema-300 bg-white px-3 py-2 text-sm text-espresso-950 placeholder:text-espresso-600/50 focus:border-canopy-700 focus:outline-none focus:ring-1 focus:ring-canopy-700"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-medium uppercase tracking-wider text-espresso-700"
                >
                  Pick-Up / Roast Notes (Optional)
                </label>
                <input
                  id="checkout-notes"
                  name="pickupNotes"
                  type="text"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="Oat milk, pick-up in 15 mins..."
                  className="mt-1 w-full rounded-lg border border-crema-300 bg-white px-3 py-2 text-sm text-espresso-950 placeholder:text-espresso-600/50 focus:border-canopy-700 focus:outline-none focus:ring-1 focus:ring-canopy-700"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-terracotta-600/10 px-3 py-2 text-xs font-medium text-terracotta-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-testid="checkout-submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso-950 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying & Placing Order...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Checkout • {formatCurrency(totalCents)}
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-espresso-700">
              All totals are verified server-side against live roastery pricing.
            </p>
          </form>
        )}
      </aside>
    </div>
  );
}
