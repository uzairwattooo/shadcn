import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
    { id: 1, name: "Wireless Headphones", price: 45 },
    { id: 2, name: "Smart Watch", price: 80 },
    { id: 3, name: "Gaming Mouse", price: 25 },
];

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Shop Products</h1>
                    <p className="text-muted-foreground">
                        Browse products and place your order.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card key={product.id} className="shadow-sm transition hover:shadow-md">
                            <CardContent className="space-y-4 p-5">
                                <div className="flex h-40 items-center justify-center rounded-lg bg-slate-200">
                                    <span className="text-sm text-slate-500">Product Image</span>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-xl font-bold text-cyan-600">
                                        ${product.price}
                                    </p>
                                </div>

                                <Button className="w-full">Buy Now</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}