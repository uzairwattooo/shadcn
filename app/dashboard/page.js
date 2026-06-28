"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const orders = [
    { id: 1001, name: "Ali Khan", status: "Completed", amount: 1200 },
    { id: 1002, name: "Ahmed Raza", status: "Pending", amount: 800 },
    { id: 1003, name: "Sara Malik", status: "Completed", amount: 1500 },
    { id: 1004, name: "Usman Ali", status: "Cancelled", amount: 500 },
];

export default function DashboardPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch = order.name.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === "all" || order.status === status;

            return matchSearch && matchStatus;
        });
    }, [search, status]);

    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    const completedOrders = orders.filter((order) => order.status === "Completed").length;

    return (
        <div className="space-y-6 rounded-xl bg-slate-50 p-4">
            <div className="rounded-xl border bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-sm">
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-200">
                    Here is your business overview.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Sales"
                    value={`$${totalSales}`}
                    badge="+12%"
                    color="border-blue-500"
                />
                <StatsCard
                    title="Orders"
                    value={orders.length}
                    badge="+8%"
                    color="border-orange-500"
                />
                <StatsCard
                    title="Completed"
                    value={completedOrders}
                    badge="Done"
                    color="border-green-500"
                />
                <StatsCard
                    title="Products"
                    value="89"
                    badge="Active"
                    color="border-purple-500"
                />
            </div>
            <Card className="border-0 shadow-sm">
                <CardHeader className="space-y-4">
                    <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Search and filter customer orders.
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <Input
                            className="bg-slate-50"
                            placeholder="Search customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="bg-slate-50">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between rounded-lg border bg-white p-4 transition hover:bg-slate-50"
                                >
                                    <div>
                                        <p className="font-medium">{order.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Order #{order.id} · ${order.amount}
                                        </p>
                                    </div>

                                    <Badge
                                        className={
                                            order.status === "Completed"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No orders found.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, badge, color }) {
    return (
        <Card className={`border-4 ${color} shadow-sm transition`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <Badge variant="secondary">{badge}</Badge>
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
            </CardContent>
        </Card>
    );
}