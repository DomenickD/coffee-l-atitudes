import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(featured === "true" ? { isFeatured: true } : {}),
      },
      include: {
        category: true,
        farmLot: true,
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { error: "Unable to load products." },
      { status: 500 }
    );
  }
}
