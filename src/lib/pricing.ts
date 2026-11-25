export interface PricingProductRecord {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  inStock: boolean;
  categorySlug: string;
  weightOptions: string[];
  grindOptions: string[];
  sizeOptions: string[];
}

export interface RequestedCartItem {
  productId: string;
  quantity: number;
  grindOption?: string | null;
  weightOption?: string | null;
  sizeOption?: string | null;
  notes?: string | null;
}

export interface PricedOrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  categorySlug: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  grindOption: string | null;
  weightOption: string | null;
  sizeOption: string | null;
  notes: string | null;
}

export interface CalculatedOrderPricing {
  items: PricedOrderItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  orderType: "PICKUP" | "SHIPPING" | "MIXED";
}

export class CheckoutValidationError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "CheckoutValidationError";
    this.statusCode = statusCode;
  }
}

export const TAX_RATE = 0.0825;

const WEIGHT_MULTIPLIERS: Record<string, number> = {
  "12oz": 1.0,
  "16oz": 1.25,
  "2lb": 2.25,
};

/**
 * Authoritative unit price calculation based on base DB price and optional bag weight.
 * Always rounded to the nearest 50 cents for non-base weights so UI and server stay identical.
 */
export function computeUnitPriceCents(
  basePriceCents: number,
  weightOption?: string | null
): number {
  if (!weightOption) return basePriceCents;
  const multiplier = WEIGHT_MULTIPLIERS[weightOption];
  if (!multiplier || multiplier === 1.0) {
    return basePriceCents;
  }
  return Math.round((basePriceCents * multiplier) / 50) * 50;
}

export function calculateOrderPricing(
  requestedItems: RequestedCartItem[],
  catalogById: Map<string, PricingProductRecord>
): CalculatedOrderPricing {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new CheckoutValidationError("Your cart is empty.", 400);
  }

  let subtotalCents = 0;
  let hasCafeItems = false;
  let hasShippableItems = false;
  const pricedItems: PricedOrderItem[] = [];

  for (const req of requestedItems) {
    if (!req.productId || typeof req.productId !== "string") {
      throw new CheckoutValidationError("Invalid product identifier.", 400);
    }

    if (
      !Number.isInteger(req.quantity) ||
      req.quantity < 1 ||
      req.quantity > 50
    ) {
      throw new CheckoutValidationError(
        `Invalid quantity (${req.quantity}) for product ${req.productId}. Must be between 1 and 50.`,
        400
      );
    }

    const product = catalogById.get(req.productId);
    if (!product) {
      throw new CheckoutValidationError(
        `Product not found: ${req.productId}`,
        404
      );
    }

    if (!product.inStock) {
      throw new CheckoutValidationError(
        `Product is currently out of stock: ${product.name}`,
        409
      );
    }

    const weightOption = req.weightOption?.trim() || null;
    if (product.weightOptions.length > 0) {
      const chosenWeight = weightOption ?? product.weightOptions[0];
      if (!product.weightOptions.includes(chosenWeight)) {
        throw new CheckoutValidationError(
          `Invalid weight option "${chosenWeight}" for ${product.name}.`,
          400
        );
      }
    }

    const grindOption = req.grindOption?.trim() || null;
    if (product.grindOptions.length > 0 && grindOption) {
      if (!product.grindOptions.includes(grindOption)) {
        throw new CheckoutValidationError(
          `Invalid grind option "${grindOption}" for ${product.name}.`,
          400
        );
      }
    }

    const sizeOption = req.sizeOption?.trim() || null;
    if (product.sizeOptions.length > 0 && sizeOption) {
      if (!product.sizeOptions.includes(sizeOption)) {
        throw new CheckoutValidationError(
          `Invalid size option "${sizeOption}" for ${product.name}.`,
          400
        );
      }
    }

    const effectiveWeight =
      product.weightOptions.length > 0
        ? weightOption ?? product.weightOptions[0]
        : null;
    const effectiveGrind =
      product.grindOptions.length > 0
        ? grindOption ?? product.grindOptions[0]
        : null;
    const effectiveSize =
      product.sizeOptions.length > 0
        ? sizeOption ?? product.sizeOptions[0]
        : null;

    const unitPriceCents = computeUnitPriceCents(
      product.priceCents,
      effectiveWeight
    );
    const lineTotalCents = unitPriceCents * req.quantity;
    subtotalCents += lineTotalCents;

    if (product.categorySlug === "cafe-menu") {
      hasCafeItems = true;
    } else {
      hasShippableItems = true;
    }

    pricedItems.push({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      categorySlug: product.categorySlug,
      unitPriceCents,
      quantity: req.quantity,
      lineTotalCents,
      grindOption: effectiveGrind,
      weightOption: effectiveWeight,
      sizeOption: effectiveSize,
      notes: req.notes?.trim() ? req.notes.trim().slice(0, 240) : null,
    });
  }

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const orderType: "PICKUP" | "SHIPPING" | "MIXED" =
    hasCafeItems && hasShippableItems
      ? "MIXED"
      : hasCafeItems
        ? "PICKUP"
        : "SHIPPING";

  return {
    items: pricedItems,
    subtotalCents,
    taxCents,
    totalCents,
    orderType,
  };
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
