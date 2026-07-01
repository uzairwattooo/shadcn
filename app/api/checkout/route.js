import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { product, user } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
    const body = await req.json();
    const { productId, customer } = body;

    const [selectedProduct] = await db.select().from(product).where(eq(product.id, productId));
    if (!selectedProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const [seller] = await db.select().from(user).where(eq(user.id, selectedProduct.sellerId));
    if (!seller?.stripeAccountId) {
        return NextResponse.json({ message: "Seller Stripe not connected" }, { status: 400 });
    }

    const amount = Number(selectedProduct.price) * 100;
    const adminFee = Math.round(amount * 0.1);

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customer.email,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: selectedProduct.name,
                        description: selectedProduct.description || "",
                        images: selectedProduct.image ? [selectedProduct.image] : [],
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        payment_intent_data: {
            application_fee_amount: adminFee,
            transfer_data: {
                destination: seller.stripeAccountId,
            },
        },
        metadata: {
            productId,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: customer.address,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/customer?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${productId}`,
    });

    return NextResponse.json({ url: session.url });
}