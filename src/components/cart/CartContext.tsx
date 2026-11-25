"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { computeUnitPriceCents, TAX_RATE } from "@/lib/pricing";

export interface CartItem {
  key: string;
  productId: string;
  productSlug: string;
  name: string;
  categorySlug: string;
  imageUrl: string;
  basePriceCents: number;
  unitPriceCents: number;
  quantity: number;
  weightOption: string | null;
  grindOption: string | null;
  sizeOption: string | null;
}

export interface AddToCartPayload {
  productId: string;
  productSlug: string;
  name: string;
  categorySlug: string;
  imageUrl: string;
  basePriceCents: number;
  quantity?: number;
  weightOption?: string | null;
  grindOption?: string | null;
  sizeOption?: string | null;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (payload: AddToCartPayload) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "coffee-latitudes-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function makeItemKey(
  productId: string,
  weightOption?: string | null,
  grindOption?: string | null,
  sizeOption?: string | null
): string {
  return [
    productId,
    weightOption || "",
    grindOption || "",
    sizeOption || "",
  ].join("::");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback((payload: AddToCartPayload) => {
    const qty = payload.quantity ?? 1;
    const weightOption = payload.weightOption ?? null;
    const grindOption = payload.grindOption ?? null;
    const sizeOption = payload.sizeOption ?? null;
    const key = makeItemKey(
      payload.productId,
      weightOption,
      grindOption,
      sizeOption
    );
    const unitPriceCents = computeUnitPriceCents(
      payload.basePriceCents,
      weightOption
    );

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(50, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: payload.productId,
          productSlug: payload.productSlug,
          name: payload.name,
          categorySlug: payload.categorySlug,
          imageUrl: payload.imageUrl,
          basePriceCents: payload.basePriceCents,
          unitPriceCents,
          quantity: qty,
          weightOption,
          grindOption,
          sizeOption,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.key !== key);
      }
      return prev.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.min(50, quantity) }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalCents = items.reduce(
      (acc, item) => acc + item.unitPriceCents * item.quantity,
      0
    );
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + taxCents;
    return { itemCount, subtotalCents, taxCents, totalCents };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      ...totals,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      isOpen,
      totals,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
