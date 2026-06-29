import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;
    const role = user?.role;

    if (role === "seller") {
        return <SellerDashboard user={user} />;
    }

    if (role === "admin") {
        return <AdminDashboard user={user} />;
    }

    return <CustomerDashboard user={user} />;
}

function SellerDashboard({ user }) {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h2 className="text-3xl font-bold">Seller Dashboard</h2>
                <p className="text-slate-300">Welcome {user.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard title="My Products" value="0" />
                <StatsCard title="My Orders" value="0" />
                <StatsCard title="Stripe Status" value={user.stripeOnboarded ? "Connected" : "Not Connected"} />
            </div>

            {!user.stripeOnboarded && (
                <Card>
                    <CardHeader>
                        <CardTitle>Connect Stripe</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Connect your Stripe account to receive payments.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/connect">Connect Stripe</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function AdminDashboard({ user }) {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                <p className="text-slate-300">Welcome {user.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard title="Sellers" value="0" />
                <StatsCard title="Products" value="0" />
                <StatsCard title="Orders" value="0" />
            </div>
        </div>
    );
}

function CustomerDashboard({ user }) {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h2 className="text-3xl font-bold">Customer Dashboard</h2>
                <p className="text-slate-300">Welcome {user.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard title="My Orders" value="0" />
                <StatsCard title="Wishlist" value="0" />
                <StatsCard title="Account" value="Active" />
            </div>
        </div>
    );
}

function StatsCard({ title, value }) {
    return (
        <Card className="border-l-4 border-l-cyan-500 shadow-sm">
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <Badge variant="secondary" className="mt-2">Live</Badge>
            </CardContent>
        </Card>
    );
}