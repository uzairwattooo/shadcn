import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { product } from "@/db/schema";

export async function GET() {
    const products = await db.select().from(product);
    return NextResponse.json(products);
}

export async function POST(req) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "seller") return NextResponse.json({ message: "Only seller can add product" }, { status: 403 });

    const body = await req.json();

    const [newProduct] = await db.insert(product).values({
        id: crypto.randomUUID(),
        name: body.name,
        price: Number(body.price),
        description: body.description || "",
        image: body.image || "",
        sellerId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    return NextResponse.json(newProduct);
}