import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "seller") {
            return NextResponse.json(
                { message: "Only sellers can connect Stripe" },
                { status: 403 }
            );
        }

        let stripeAccountId = session.user.stripeAccountId;

        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: "express",
                email: session.user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });

            stripeAccountId = account.id;

            await db
                .update(user)
                .set({
                    stripeAccountId,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, session.user.id));
        }

        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller`,
            type: "account_onboarding",
        });

        return NextResponse.json({ url: accountLink.url });
    } catch (error) {
        console.log("STRIPE_CONNECT_ERROR:", error);

        return NextResponse.json(
            { message: "Failed to create Stripe Connect link" },
            { status: 500 }
        );
    }
}