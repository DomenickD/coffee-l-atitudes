import { Resend } from "resend";
import { formatCurrency } from "./pricing";

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderType: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  items: Array<{
    productName: string;
    quantity: number;
    lineTotalCents: number;
    grindOption?: string | null;
    weightOption?: string | null;
    sizeOption?: string | null;
  }>;
}

export async function sendOrderConfirmationEmail(
  payload: OrderEmailPayload
): Promise<{ delivered: boolean; mode: "resend" | "console" }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "orders@coffeelatitudes.com";

  const itemSummary = payload.items
    .map((item) => {
      const opts = [item.weightOption, item.grindOption, item.sizeOption]
        .filter(Boolean)
        .join(" / ");
      return `- ${item.quantity}x ${item.productName}${opts ? ` (${opts})` : ""}: ${formatCurrency(item.lineTotalCents)}`;
    })
    .join("\n");

  if (!apiKey) {
    console.info(
      `[Email Fallback] Order confirmation for ${payload.customerEmail}\n` +
        `Order #: ${payload.orderNumber} (${payload.orderType})\n` +
        `${itemSummary}\n` +
        `Total: ${formatCurrency(payload.totalCents)}`
    );
    return { delivered: true, mode: "console" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `Coffee Latitudes <${from}>`,
      to: [payload.customerEmail],
      subject: `Coffee Latitudes Order Confirmed — ${payload.orderNumber}`,
      text: [
        `Hi ${payload.customerName},`,
        "",
        `Thank you for ordering with Coffee Latitudes! Your order ${payload.orderNumber} is confirmed.`,
        "",
        "Order Summary:",
        itemSummary,
        "",
        `Subtotal: ${formatCurrency(payload.subtotalCents)}`,
        `Tax: ${formatCurrency(payload.taxCents)}`,
        `Total: ${formatCurrency(payload.totalCents)}`,
        "",
        "Roasted with care across the Coffee Belt,",
        "James Frank & the Coffee Latitudes Team",
        "https://coffeelatitudes.com",
      ].join("\n"),
    });
    return { delivered: true, mode: "resend" };
  } catch (err) {
    console.error("[Email Error] Failed to dispatch via Resend:", err);
    return { delivered: false, mode: "resend" };
  }
}
