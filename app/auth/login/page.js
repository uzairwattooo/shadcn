"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginPage() {
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) newErrors.email = "Email is required";
        else if (!email.includes("@")) newErrors.email = "Enter valid email";

        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const router = useRouter();

    const loginMutation = useMutation({

        mutationFn: async ({ email, password }) => {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) throw new Error(error.message);
            return data;
        },

        onSuccess: async () => {
            const { data } = await authClient.getSession();
            const role = data?.user?.role;
            if (role === "admin") {
                router.push("/dashboard");
            } else if (role === "seller") {
                router.push("/seller");
            } else {
                router.push("/customer");
            }
            toast.success("Login successful");
        },

        onError: (error) => {
            toast.error(error.message || "Login failed");
        },
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validate()) return;
        loginMutation.mutate({
            email: e.target.email.value,
            password: e.target.password.value,
        });
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-90">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                        <Button className="w-full" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Logging in..." : "Login"}</Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="font-medium text-primary">
                                Signup
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}