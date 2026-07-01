import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { product } from "@/db/schema";

export async function PUT(req, { params }) {
    const { id } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const [updated] = await db
        .update(product)
        .set({
            name: body.name,
            price: Number(body.price),
            description: body.description || "",
            image: body.image || "",
            updatedAt: new Date(),
        })
        .where(and(eq(product.id, id), eq(product.sellerId, session.user.id)))
        .returning();

    if (!updated) {
        return NextResponse.json(
            { message: "Product not found or not allowed" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
    const { id } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db
        .delete(product)
        .where(and(eq(product.id, id), eq(product.sellerId, session.user.id)));

    return NextResponse.json({ message: "Product deleted" });
}