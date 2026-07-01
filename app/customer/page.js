import Link from "next/link";
import { db } from "@/db";
import { product } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ShopPage() {
    const products = await db.select().from(product);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <h1 className="text-3xl font-bold">Shop Products</h1>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="space-y-4 p-5">
                                {item.image && (
                                    <img src={item.image} className="h-48 w-full rounded-lg object-contain" />
                                )}
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="font-bold text-cyan-600">${item.price}</p>
                                <Button asChild className="w-full">
                                    <Link href={`/checkout/${item.id}`}>Buy Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}