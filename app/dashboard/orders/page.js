import { db } from "@/db";
import { marketplaceOrders, product } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function OrdersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/auth/login");
    }

    if (session.user.role !== "admin") {
        redirect("/dashboard");
    }
    const orders = await db
        .select({
            id: marketplaceOrders.id,
            customerName: marketplaceOrders.customerName,
            customerEmail: marketplaceOrders.customerEmail,
            amount: marketplaceOrders.amount,
            adminFee: marketplaceOrders.adminFee,
            sellerAmount: marketplaceOrders.sellerAmount,
            status: marketplaceOrders.status,
            createdAt: marketplaceOrders.createdAt,
            productName: product.name,
        })
        .from(marketplaceOrders)
        .leftJoin(product, eq(marketplaceOrders.productId, product.id))
        .orderBy(desc(marketplaceOrders.createdAt));

    const formatMoney = (amount) => `$${(amount / 100).toFixed(2)}`;

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-slate-300">
                    Platform orders and commission breakdown.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Marketplace Orders</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-3">Product</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Total</th>
                                    <th className="p-3">Admin Fee</th>
                                    <th className="p-3">Seller Amount</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-6 text-center text-muted-foreground"
                                        >
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b">
                                            <td className="p-3 font-medium">
                                                {order.productName || "Deleted Product"}
                                            </td>

                                            <td className="p-3">
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customerEmail}
                                                </p>
                                            </td>

                                            <td className="p-3 font-medium">
                                                {formatMoney(order.amount)}
                                            </td>

                                            <td className="p-3 font-medium text-green-600">
                                                {formatMoney(order.adminFee)}
                                            </td>

                                            <td className="p-3">
                                                {formatMoney(order.sellerAmount)}
                                            </td>

                                            <td className="p-3">
                                                <Badge>{order.status}</Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}