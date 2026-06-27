import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-90">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="Enter your email" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="Enter your password" />
                        </div>
                        <Button className="w-full">Login</Button>
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