import React from "react";
import Link from "next/link";
import { CheckCircle2, Coffee, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string; mock?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;
  const isMock = params.mock === "1";

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
    : null;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div
          data-testid="checkout-confirmation"
          className="overflow-hidden rounded-3xl border border-crema-200 bg-white shadow-lg"
        >
          <div className="bg-canopy-900 px-8 py-10 text-center text-crema-50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-crema-50/15 text-crema-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-crema-300">
              {isMock ? "Test Mode Checkout Confirmed" : "Order Confirmed"}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-white">
              Thank You for Your Order
            </h1>
            {order && (
              <p
                data-testid="order-number"
                className="mt-2 font-mono text-sm text-crema-200"
              >
                Order #{order.orderNumber}
              </p>
            )}
          </div>

          <div className="p-8">
            {!order ? (
              <div className="text-center py-6">
                <p className="text-sm text-espresso-800">
                  We could not locate an order for this reference. If you just
                  completed payment, check your email receipt or reach out to{" "}
                  <a
                    href="mailto:james@coffeelatitudes.com"
                    className="font-semibold underline"
                  >
                    james@coffeelatitudes.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-crema-200 pb-5 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-espresso-600">
                      Customer
                    </p>
                    <p className="font-semibold text-espresso-950">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-espresso-700">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-espresso-600">
                      Fulfillment &amp; Status
                    </p>
                    <p className="inline-flex items-center gap-1.5 font-semibold text-canopy-800">
                      {order.orderType === "PICKUP" ? (
                        <Coffee className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                      {order.orderType} • {order.status}
                    </p>
                  </div>
                </div>

                {order.pickupNotes && (
                  <div className="mt-4 rounded-xl bg-crema-100 px-4 py-3 text-xs text-espresso-800">
                    <strong className="uppercase tracking-wider">Notes:</strong>{" "}
                    {order.pickupNotes}
                  </div>
                )}

                <ul className="mt-6 divide-y divide-crema-200">
                  {order.items.map((item) => {
                    const opts = [
                      item.weightOption,
                      item.grindOption,
                      item.sizeOption,
                    ].filter(Boolean);

                    return (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-4 py-3.5 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-espresso-950">
                            {item.quantity} × {item.productName}
                          </p>
                          {opts.length > 0 && (
                            <p className="text-xs text-espresso-700">
                              {opts.join(" • ")}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-espresso-950">
                          {formatCurrency(item.lineTotalCents)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 space-y-1.5 border-t border-crema-200 pt-5 text-sm">
                  <div className="flex justify-between text-espresso-700">
                    <span>Subtotal</span>
                    <span data-testid="confirmed-subtotal">
                      {formatCurrency(order.subtotalCents)}
                    </span>
                  </div>
                  <div className="flex justify-between text-espresso-700">
                    <span>Tax</span>
                    <span>{formatCurrency(order.taxCents)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-semibold text-espresso-950">
                    <span>Total Paid</span>
                    <span data-testid="confirmed-total">
                      {formatCurrency(order.totalCents)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-espresso-950 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-crema-50 transition hover:bg-canopy-800"
              >
                Return Home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-espresso-900 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-espresso-950 transition hover:bg-espresso-950 hover:text-crema-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
