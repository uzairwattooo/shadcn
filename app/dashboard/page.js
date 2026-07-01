import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { product, user as userTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;
    const role = user?.role;

    const totalProducts = await db
        .select({ count: sql`count(*)` })
        .from(product);

    const totalSellers = await db
        .select({ count: sql`count(*)` })
        .from(userTable)
        .where(eq(userTable.role, "seller"));

    const sellerProducts = await db
        .select({ count: sql`count(*)` })
        .from(product)
        .where(eq(product.sellerId, user.id));

    if (role === "seller") {
        return (
            <SellerDashboard
                user={user}
                productCount={sellerProducts[0].count}
            />
        );
    }

    if (role === "admin") {
        return (
            <AdminDashboard
                user={user}
                sellerCount={totalSellers[0].count}
                productCount={totalProducts[0].count}
            />
        );
    }

    return <CustomerDashboard user={user} />;
}

function SellerDashboard({ user, productCount }) {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h2 className="text-3xl font-bold">Seller Dashboard</h2>
                <p className="text-slate-300">Welcome {user.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard title="My Products" value={productCount} />
                <StatsCard title="My Orders" value="0" />
                <StatsCard
                    title="Stripe Status"
                    value={user.stripeOnboarded ? "Connected" : "Not Connected"}
                />
            </div>
        </div>
    );
}
function AdminDashboard({ user, sellerCount, productCount }) {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                <p className="text-slate-300">Welcome {user.name}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard title="Sellers" value={sellerCount} />
                <StatsCard title="Products" value={productCount} />
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