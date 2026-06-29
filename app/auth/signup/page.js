"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState("customer");
    const router = useRouter();

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!email.includes("@")) {
            newErrors.email = "Enter valid email";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!role.trim()) {
            newErrors.role = "role is required";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const signupMutation = useMutation({
        mutationFn: async ({ name, email, password }) => {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                role,
            });

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            router.push("/dashboard");
        },
        onError: (error) => {
            toast.error(error.message || "Signup failed");
        },
    });
    const handleSignup = (e) => {
        e.preventDefault();
        if (!validate()) return;
        signupMutation.mutate({
            name,
            email,
            password,
            role,
        });
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-90">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input name="name" type="name" value={name}
                                onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Account Type</Label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                            </select>
                            
                        </div>
                        <Button className="w-full" disabled={signupMutation.isPending}>{signupMutation.isPending ? "Creating..." : "Signup"}</Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-primary">
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}