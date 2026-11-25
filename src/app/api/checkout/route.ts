import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  calculateOrderPricing,
  CheckoutValidationError,
  PricingProductRecord,
} from "@/lib/pricing";
import { getStripeClient, isMockStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(120),
  customerEmail: z.string().trim().email("Valid email is required").max(180),
  pickupNotes: z.string().trim().max(300).optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
        grindOption: z.string().max(80).optional().nullable(),
        weightOption: z.string().max(40).optional().nullable(),
        sizeOption: z.string().max(60).optional().nullable(),
        notes: z.string().max(240).optional().nullable(),
      })
    )
    .min(1, "Cart must contain at least one item"),
});

function generateOrderNumber(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `CL-${stamp}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const parsed = checkoutSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid checkout request.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, pickupNotes, items } = parsed.data;
    const productIds = Array.from(new Set(items.map((item) => item.productId)));

    // Look up authoritative products from PostgreSQL (never trusting client prices)
    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [{ id: { in: productIds } }, { slug: { in: productIds } }],
      },
      include: { category: true },
    });

    const catalogById = new Map<string, PricingProductRecord>();
    for (const p of dbProducts) {
      const record: PricingProductRecord = {
        id: p.id,
        slug: p.slug,
        name: p.name,
        priceCents: p.priceCents,
        inStock: p.inStock,
        categorySlug: p.category.slug,
        weightOptions: p.weightOptions,
        grindOptions: p.grindOptions,
        sizeOptions: p.sizeOptions,
      };
      catalogById.set(p.id, record);
      catalogById.set(p.slug, record);
    }

    const pricing = calculateOrderPricing(items, catalogById);
    const mockMode = isMockStripe();
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: mockMode ? "PAID" : "PENDING",
        orderType: pricing.orderType,
        customerName,
        customerEmail,
        pickupNotes: pickupNotes || null,
        subtotalCents: pricing.subtotalCents,
        taxCents: pricing.taxCents,
        totalCents: pricing.totalCents,
        currency: "usd",
        isMockPayment: mockMode,
        items: {
          create: pricing.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
            lineTotalCents: item.lineTotalCents,
            grindOption: item.grindOption,
            weightOption: item.weightOption,
            sizeOption: item.sizeOption,
            notes: item.notes,
          })),
        },
      },
      include: { items: true },
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      request.nextUrl.origin;

    if (mockMode) {
      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderType: order.orderType,
        subtotalCents: order.subtotalCents,
        taxCents: order.taxCents,
        totalCents: order.totalCents,
        items: order.items,
      });

      const redirectPath = `/checkout/success?mock=1&orderId=${encodeURIComponent(order.id)}`;
      return NextResponse.json(
        {
          url: redirectPath,
          orderId: order.id,
          orderNumber: order.orderNumber,
          subtotalCents: order.subtotalCents,
          taxCents: order.taxCents,
          totalCents: order.totalCents,
          mock: true,
        },
        { status: 201 }
      );
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      line_items: [
        ...pricing.items.map((item) => {
          const desc = [item.weightOption, item.grindOption, item.sizeOption]
            .filter(Boolean)
            .join(" • ");
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.productName,
                ...(desc ? { description: desc } : {}),
              },
              unit_amount: item.unitPriceCents,
            },
            quantity: item.quantity,
          };
        }),
        ...(pricing.taxCents > 0
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: { name: "Estimated Tax" },
                  unit_amount: pricing.taxCents,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      success_url: `${origin}/checkout/success?orderId=${encodeURIComponent(order.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?checkout=cancelled`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json(
      {
        url: session.url,
        orderId: order.id,
        orderNumber: order.orderNumber,
        subtotalCents: order.subtotalCents,
        taxCents: order.taxCents,
        totalCents: order.totalCents,
        mock: false,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("POST /api/checkout failed:", error);
    return NextResponse.json(
      { error: "Unable to complete checkout." },
      { status: 500 }
    );
  }
}
