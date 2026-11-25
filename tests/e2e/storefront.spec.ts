import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createdOrderIds: string[] = [];

test.afterAll(async () => {
  if (createdOrderIds.length > 0) {
    await prisma.order.deleteMany({
      where: { id: { in: createdOrderIds } },
    });
  }
  await prisma.$disconnect();
});

test.describe("Coffee Latitudes Storefront E2E", () => {
  test("Hero renders with all 5 hotspot buttons visible and clickable", async ({
    page,
  }) => {
    await page.goto("/");

    const hero = page.getByTestId("brick-wall-hero");
    await expect(hero).toBeVisible();

    const hotspotIds = [
      "order-pickup",
      "cafe-menu",
      "bagged-coffee",
      "merch",
      "learn-about-us",
    ];

    for (const id of hotspotIds) {
      const btn = page.getByTestId(`hero-hotspot-${id}`);
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute("href", /.+/);
    }

    // Click the Café Menu hotspot and confirm navigation
    await page.getByTestId("hero-hotspot-cafe-menu").click();
    await expect(page).toHaveURL(/\/menu/);
    await expect(
      page.getByRole("heading", { name: /Café Menu & Local Pick-Up/i })
    ).toBeVisible();
  });

  test("?calibrate=1 toggles coordinate calibration overlay cleanly", async ({
    page,
  }) => {
    await page.goto("/?calibrate=1");

    const overlay = page.getByTestId("calibration-overlay");
    await expect(overlay).toBeVisible();
    await expect(page.getByTestId("calibration-json")).toContainText(
      '"order-pickup"'
    );

    // Exit calibration mode cleanly
    await overlay.getByRole("button", { name: "Exit" }).click();
    await expect(overlay).toBeHidden();
  });

  test("Adding Café Menu item + Bagged Coffee (with grind option) updates subtotal and persists mock Order in Postgres", async ({
    page,
  }) => {
    // 1. Add Café Menu item ($4.75)
    await page.goto("/menu");
    await page.getByTestId("add-to-cart-latitude-signature-cortado").click();

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("cart-subtotal")).toHaveText("$4.75");

    // Close drawer and navigate to Shop
    await drawer.getByRole("button", { name: "Close cart" }).click();
    await expect(drawer).toBeHidden();

    // 2. Add Bagged Coffee with custom grind option ($21.00)
    await page.goto("/shop?category=bagged-coffee");
    const grindSelect = page.getByTestId(
      "grind-select-nicaragua-jinotega-honey-bag"
    );
    await grindSelect.selectOption("Pour-Over (Medium-Fine)");
    await page.getByTestId("add-to-cart-nicaragua-jinotega-honey-bag").click();

    await expect(drawer).toBeVisible();
    // $4.75 + $21.00 = $25.75
    await expect(page.getByTestId("cart-subtotal")).toHaveText("$25.75");
    await expect(drawer).toContainText("Pour-Over (Medium-Fine)");

    // 3. Complete Mock Checkout
    await drawer.locator('input[name="customerName"]').fill("James Frank");
    await drawer
      .locator('input[name="customerEmail"]')
      .fill("james@coffeelatitudes.com");
    await drawer
      .locator('input[name="pickupNotes"]')
      .fill("Playwright E2E verification order");
    await page.getByTestId("checkout-submit").click();

    // 4. Verify Confirmation Page & Postgres Persistence
    await expect(page).toHaveURL(/\/checkout\/success\?mock=1&orderId=/);
    await expect(page.getByTestId("checkout-confirmation")).toBeVisible();
    await expect(page.getByTestId("confirmed-subtotal")).toHaveText("$25.75");

    const url = new URL(page.url());
    const orderId = url.searchParams.get("orderId");
    expect(orderId).toBeTruthy();

    if (orderId) {
      createdOrderIds.push(orderId);
      const dbOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      expect(dbOrder).not.toBeNull();
      expect(dbOrder?.status).toBe("PAID");
      expect(dbOrder?.isMockPayment).toBe(true);
      expect(dbOrder?.subtotalCents).toBe(2575);
      expect(dbOrder?.items).toHaveLength(2);
      const bagItem = dbOrder?.items.find((i) =>
        i.productName.includes("Nicaragua")
      );
      expect(bagItem?.grindOption).toBe("Pour-Over (Medium-Fine)");
    }
  });
});
