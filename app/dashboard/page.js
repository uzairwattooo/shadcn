import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="text-muted-foreground">
                    Here is your business overview.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Sales" value="$12,450" badge="+12%" />
                <StatsCard title="Orders" value="342" badge="+8%" />
                <StatsCard title="Customers" value="1,240" badge="+18%" />
                <StatsCard title="Products" value="89" badge="Active" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {["Ali Khan", "Ahmed Raza", "Sara Malik"].map((name, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">{name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Order #{1000 + index}
                                    </p>
                                </div>

                                <Badge>Completed</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, badge }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Badge variant="secondary">{badge}</Badge>
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}