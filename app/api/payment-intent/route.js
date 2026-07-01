import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { product, user } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
    try {
        const body = await req.json();
        const { productId, customer } = body;

        const [selectedProduct] = await db
            .select()
            .from(product)
            .where(eq(product.id, productId));

        if (!selectedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const [seller] = await db
            .select()
            .from(user)
            .where(eq(user.id, selectedProduct.sellerId));

        if (!seller?.stripeAccountId) {
            return NextResponse.json(
                { message: "Seller Stripe not connected" },
                { status: 400 }
            );
        }

        const amount = Number(selectedProduct.price) * 100;
        const adminFee = Math.round(amount * 0.1);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            application_fee_amount: adminFee,
            transfer_data: {
                destination: seller.stripeAccountId,
            },
            metadata: {
                productId,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                customerAddress: customer.address,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log("PAYMENT_INTENT_ERROR:", error);

        return NextResponse.json(
            { message: "Failed to create payment intent" },
            { status: 500 }
        );
    }
}