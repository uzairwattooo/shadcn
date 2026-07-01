"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";


export default function ConnectStripePage() {
    const connectStripe = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/stripe/connect", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Stripe connect failed");
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
        <div className="max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Stripe Connect</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Connect your Stripe account to receive payments from customers.
                    </p>

                    <Button
                        onClick={() => connectStripe.mutate()}
                        disabled={connectStripe.isPending}
                    >
                        {connectStripe.isPending ? "Connecting..." : "Connect Stripe"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}