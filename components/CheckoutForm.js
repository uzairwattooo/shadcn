"use client";

import { useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutForm({ productId, stripePromise }) {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const createIntent = useMutation({
        mutationFn: async () => {
            if (!customer.name || !customer.email || !customer.phone || !customer.address) {
                throw new Error("Please fill all customer details");
            }
            const res = await fetch("/api/payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    customer,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    if (createIntent.data?.clientSecret) {
        return (
            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret: createIntent.data.clientSecret,
                    appearance: {
                        theme: "stripe",
                        variables: {
                            colorPrimary: "#06b6d4",
                            colorBackground: "#ffffff",
                            colorText: "#0f172a",
                            borderRadius: "10px",
                        },
                    },
                }}
            >
                <PaymentBox customer={customer} />
            </Elements>
        );
    }
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="rounded-t-lg bg-slate-950 text-white">
                <CardTitle>Checkout Details</CardTitle>
                <p className="text-sm text-slate-300">
                    Fill your details before payment.
                </p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
                <div>
                    <Label>Name</Label>
                    <Input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="Enter phone number"
                    />
                </div>
                <div>
                    <Label>Address</Label>
                    <Input
                        value={customer.address}
                        onChange={(e) =>
                            setCustomer({ ...customer, address: e.target.value })
                        }
                        placeholder="Enter address"
                    />
                </div>
                <Button
                    onClick={() => createIntent.mutate()}
                    disabled={createIntent.isPending}
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                >
                    {createIntent.isPending ? "Preparing Payment..." : "Continue to Payment"}
                </Button>
            </CardContent>
        </Card>
    );
}
function PaymentBox({ customer }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setLoading(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/customer?payment=success`,
                payment_method_data: {
                    billing_details: {
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        address: {
                            line1: customer.address,
                        },
                    },
                },
            },
        });
        if (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="rounded-t-lg bg-slate-950 text-white">
                <CardTitle>Payment Details</CardTitle>
                <p className="text-sm text-slate-300">
                    Enter your card details securely.
                </p>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
                <PaymentElement />
                <Button
                    onClick={handlePay}
                    disabled={!stripe || loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </CardContent>
        </Card>
    );
}