import { describe, it, expect, afterAll } from "vitest";
import { NextRequest } from "next/server";
import {
  calculateOrderPricing,
  CheckoutValidationError,
  computeUnitPriceCents,
  PricingProductRecord,
  TAX_RATE,
} from "@/lib/pricing";
import { getActiveHotspotId } from "@/lib/hotspots";
import { GET as healthGet } from "@/app/api/health/route";
import { POST as checkoutPost } from "@/app/api/checkout/route";
import { prisma } from "@/lib/prisma";

const sampleCatalog = new Map<string, PricingProductRecord>([
  [
    "prod-cortado",
    {
      id: "prod-cortado",
      slug: "latitude-signature-cortado",
      name: "Latitude Signature Cortado",
      priceCents: 475,
      inStock: true,
      categorySlug: "cafe-menu",
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["4.5oz Classic", "6oz Oat Milk"],
    },
  ],
  [
    "prod-kona",
    {
      id: "prod-kona",
      slug: "hawaii-kona-reserve-bag",
      name: "19.6° N — Kona Volcanic Reserve",
      priceCents: 3400,
      inStock: true,
      categorySlug: "bagged-coffee",
      weightOptions: ["12oz", "16oz", "2lb"],
      grindOptions: [
        "Whole Bean",
        "Pour-Over (Medium-Fine)",
        "Drip (Medium)",
        "French Press (Coarse)",
        "Espresso (Fine)",
      ],
      sizeOptions: [],
    },
  ],
  [
    "prod-oos",
    {
      id: "prod-oos",
      slug: "sold-out-lot",
      name: "Sold Out Reserve",
      priceCents: 5000,
      inStock: false,
      categorySlug: "bagged-coffee",
      weightOptions: ["12oz"],
      grindOptions: ["Whole Bean"],
      sizeOptions: [],
    },
  ],
]);

describe("Server-side pricing and validation", () => {
  it("recalculates exact subtotal, tax, and total from authoritative catalog prices", () => {
    const result = calculateOrderPricing(
      [
        {
          productId: "prod-cortado",
          quantity: 2,
          sizeOption: "4.5oz Classic",
        },
        {
          productId: "prod-kona",
          quantity: 1,
          weightOption: "16oz",
          grindOption: "Pour-Over (Medium-Fine)",
        },
      ],
      sampleCatalog
    );

    const expectedKona16oz = computeUnitPriceCents(3400, "16oz"); // 4250
    const expectedSubtotal = 475 * 2 + expectedKona16oz; // 5200
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE);

    expect(expectedKona16oz).toBe(4250);
    expect(result.subtotalCents).toBe(expectedSubtotal);
    expect(result.taxCents).toBe(expectedTax);
    expect(result.totalCents).toBe(expectedSubtotal + expectedTax);
    expect(result.orderType).toBe("MIXED");
    expect(result.items[1].grindOption).toBe("Pour-Over (Medium-Fine)");
  });

  it("rejects unknown product IDs with 404 CheckoutValidationError", () => {
    expect(() =>
      calculateOrderPricing(
        [{ productId: "non-existent-id", quantity: 1 }],
        sampleCatalog
      )
    ).toThrow(CheckoutValidationError);

    try {
      calculateOrderPricing(
        [{ productId: "non-existent-id", quantity: 1 }],
        sampleCatalog
      );
    } catch (err) {
      expect(err).toBeInstanceOf(CheckoutValidationError);
      expect((err as CheckoutValidationError).statusCode).toBe(404);
    }
  });

  it("rejects out-of-stock products, invalid quantities, and invalid grind options", () => {
    expect(() =>
      calculateOrderPricing([{ productId: "prod-oos", quantity: 1 }], sampleCatalog)
    ).toThrow(/out of stock/i);

    expect(() =>
      calculateOrderPricing(
        [{ productId: "prod-cortado", quantity: 0 }],
        sampleCatalog
      )
    ).toThrow(/invalid quantity/i);

    expect(() =>
      calculateOrderPricing(
        [
          {
            productId: "prod-kona",
            quantity: 1,
            grindOption: "Turkish Powder",
          },
        ],
        sampleCatalog
      )
    ).toThrow(/invalid grind option/i);
  });

  it("maps hero loop timestamps (0-10s) to the 5 hotspots deterministically", () => {
    expect(getActiveHotspotId(0.5)).toBe("order-pickup");
    expect(getActiveHotspotId(2.4)).toBe("cafe-menu");
    expect(getActiveHotspotId(4.9)).toBe("bagged-coffee");
    expect(getActiveHotspotId(6.1)).toBe("merch");
    expect(getActiveHotspotId(9.2)).toBe("learn-about-us");
    expect(getActiveHotspotId(10.5)).toBe("order-pickup");
  });
});

describe("API Route Integration (PostgreSQL)", () => {
  const createdOrderIds: string[] = [];

  afterAll(async () => {
    if (createdOrderIds.length > 0) {
      await prisma.order.deleteMany({
        where: { id: { in: createdOrderIds } },
      });
    }
    await prisma.$disconnect();
  });

  it("GET /api/health returns 200 OK with connected database status", async () => {
    const response = await healthGet();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe("ok");
    expect(json.database).toBe("connected");
    expect(json.service).toBe("coffee-latitudes");
  });

  it("POST /api/checkout rejects invalid product IDs", async () => {
    const request = new NextRequest("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "QA Tester",
        customerEmail: "qa@coffeelatitudes.com",
        items: [{ productId: "does-not-exist", quantity: 1 }],
      }),
    });

    const response = await checkoutPost(request);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toMatch(/Product not found/i);
  });

  it("POST /api/checkout ignores client totals, calculates from Postgres, and persists Order", async () => {
    const cortado = await prisma.product.findUniqueOrThrow({
      where: { slug: "latitude-signature-cortado" },
    });
    const nicaragua = await prisma.product.findUniqueOrThrow({
      where: { slug: "nicaragua-jinotega-honey-bag" },
    });

    const request = new NextRequest("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Julio Figueroa",
        customerEmail: "juliofig89@gmail.com",
        // Malicious spoofed totals (must be ignored by server)
        subtotalCents: 1,
        totalCents: 1,
        items: [
          {
            productId: cortado.id,
            quantity: 1,
            sizeOption: "4.5oz Classic",
          },
          {
            productId: nicaragua.id,
            quantity: 1,
            weightOption: "12oz",
            grindOption: "Pour-Over (Medium-Fine)",
          },
        ],
      }),
    });

    const response = await checkoutPost(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.mock).toBe(true);
    expect(json.orderId).toBeTruthy();
    createdOrderIds.push(json.orderId);

    const expectedSubtotal = cortado.priceCents + nicaragua.priceCents;
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE);
    expect(json.subtotalCents).toBe(expectedSubtotal);
    expect(json.taxCents).toBe(expectedTax);
    expect(json.totalCents).toBe(expectedSubtotal + expectedTax);
    expect(json.url).toContain("/checkout/success?mock=1&orderId=");

    const persisted = await prisma.order.findUnique({
      where: { id: json.orderId },
      include: { items: true },
    });
    expect(persisted).not.toBeNull();
    expect(persisted?.totalCents).toBe(expectedSubtotal + expectedTax);
    expect(persisted?.items).toHaveLength(2);
  });
});
