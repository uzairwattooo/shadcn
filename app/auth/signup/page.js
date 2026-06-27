import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-90">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input placeholder="Enter your name" />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="Enter your email" />
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="Create password" />
                        </div>

                        <Button className="w-full">Signup</Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary">
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}