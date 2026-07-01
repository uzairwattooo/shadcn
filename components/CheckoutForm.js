"use client";

import { useState } from "react";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
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

    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setCustomer((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const newErrors = {};

        if (!customer.name.trim()) newErrors.name = "Name is required";
        if (!customer.email.trim()) newErrors.email = "Email is required";
        else if (!customer.email.includes("@")) newErrors.email = "Enter valid email";

        if (!customer.phone.trim()) newErrors.phone = "Phone number is required";
        if (!customer.address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createIntent = useMutation({
        mutationFn: async () => {
            if (!validate()) {
                throw new Error("Please fix the form errors");
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
            if (error.message !== "Please fix the form errors") {
                toast.error(error.message);
            }
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
                            borderRadius: "12px",
                        },
                    },
                }}
            >
                <PaymentBox customer={customer} />
            </Elements>
        );
    }

    return (
        <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="bg-slate-950 px-6 py-7 text-white">
                <CardTitle className="text-2xl">Checkout Details</CardTitle>
                <p className="text-sm text-slate-300">
                    Enter your delivery information before payment.
                </p>
            </CardHeader>

            <CardContent className="space-y-5 bg-white p-6">
                <FormInput
                    label="Full Name"
                    placeholder="Enter your name"
                    value={customer.name}
                    error={errors.name}
                    onChange={(value) => updateField("name", value)}
                />

                <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    error={errors.email}
                    onChange={(value) => updateField("email", value)}
                />

                <FormInput
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={customer.phone}
                    error={errors.phone}
                    onChange={(value) => updateField("phone", value)}
                />

                <FormInput
                    label="Delivery Address"
                    placeholder="Enter address"
                    value={customer.address}
                    error={errors.address}
                    onChange={(value) => updateField("address", value)}
                />

                <Button
                    onClick={() => createIntent.mutate()}
                    disabled={createIntent.isPending}
                    className="mt-2 h-11 w-full bg-cyan-500 font-medium hover:bg-cyan-600"
                >
                    {createIntent.isPending ? "Preparing Payment..." : "Continue to Payment"}
                </Button>
            </CardContent>
        </Card>
    );
}

function FormInput({ label, value, onChange, error, placeholder, type = "text" }) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">{label}</Label>

            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`h-11 ${error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200"
                    }`}
            />

            <p className="min-h-[18px] text-sm text-red-500">{error}</p>
        </div>
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
        <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="bg-slate-950 px-6 py-7 text-white">
                <CardTitle className="text-2xl">Payment Details</CardTitle>
                <p className="text-sm text-slate-300">
                    Enter your card details securely through Stripe.
                </p>
            </CardHeader>

            <CardContent className="space-y-6 bg-white p-6">
                <div className="rounded-xl border bg-slate-50 p-4">
                    <PaymentElement />
                </div>

                <Button
                    onClick={handlePay}
                    disabled={!stripe || loading}
                    className="h-11 w-full bg-cyan-500 font-medium hover:bg-cyan-600"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </CardContent>
        </Card>
    );
}