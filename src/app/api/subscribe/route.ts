import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  name: z.string().trim().max(120).optional(),
  source: z.string().trim().max(60).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email." },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: {
        name: parsed.data.name || undefined,
      },
      create: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name || null,
        source: parsed.data.source || "website",
      },
    });

    return NextResponse.json(
      {
        subscribed: true,
        id: subscriber.id,
        message: "Welcome to the Harvest Dispatch.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/subscribe failed:", error);
    return NextResponse.json(
      { error: "Unable to subscribe right now." },
      { status: 500 }
    );
  }
}
