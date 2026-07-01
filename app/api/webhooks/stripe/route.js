import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { product, marketplaceOrders } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        const productId = paymentIntent.metadata.productId;

        const [selectedProduct] = await db
            .select()
            .from(product)
            .where(eq(product.id, productId));

        if (selectedProduct) {
            const amount = paymentIntent.amount;
            const adminFee = Math.round(amount * 0.1);
            const sellerAmount = amount - adminFee;

            await db.insert(marketplaceOrders).values({
                productId: selectedProduct.id,
                sellerId: selectedProduct.sellerId,
                customerId: null,

                customerName: paymentIntent.metadata.customerName,
                customerEmail: paymentIntent.metadata.customerEmail,
                customerPhone: paymentIntent.metadata.customerPhone,
                customerAddress: paymentIntent.metadata.customerAddress,

                amount,
                adminFee,
                sellerAmount,

                paymentIntentId: paymentIntent.id,
                status: "paid",
                createdAt: new Date(),
            });
        }
    }

    return NextResponse.json({ received: true });
}