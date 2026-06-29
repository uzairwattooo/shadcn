"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SellerPage() {
    const connectStripe = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/stripe/connect", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            return data;
        },

        onSuccess: (data) => {
            window.location.href = data.url;
        },

        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <div className="mx-auto max-w-4xl p-10">
            <h1 className="mb-2 text-3xl font-bold">
                Seller Dashboard
            </h1>

            <p className="mb-8 text-muted-foreground">
                Connect your Stripe account before selling products.
            </p>

            <Button
                onClick={() => connectStripe.mutate()}
                disabled={connectStripe.isPending}
            >
                {connectStripe.isPending
                    ? "Connecting..."
                    : "Connect Stripe"}
            </Button>
        </div>
    );
}