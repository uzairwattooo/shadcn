"use client";

import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutPage() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-xl">
                <CheckoutForm productId={id} stripePromise={stripePromise} />
            </div>
        </div>
    );
}