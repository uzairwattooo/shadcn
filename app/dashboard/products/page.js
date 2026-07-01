"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
    const [image, setImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
    });
    const fileInputRef = useRef(null);
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            return res.json();
        },
    });
    const validate = () => {
        const newErrors = {};

        if (!form.name.trim())
            newErrors.name = "Product name is required";

        if (!form.price)
            newErrors.price = "Price is required";

        if (!editId && !image)
            newErrors.image = "Product image is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const saveProduct = useMutation({
        mutationFn: async () => {
            let imageUrl = form.image;

            if (image) {
                const fileName = `${Date.now()}-${image.name}`;

                const { error } = await supabase.storage
                    .from("documents")
                    .upload(fileName, image);

                if (error) throw new Error(error.message);

                const { data } = supabase.storage
                    .from("documents")
                    .getPublicUrl(fileName);

                imageUrl = data.publicUrl;
            }

            const url = editId ? `/api/products/${editId}` : "/api/products";
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    image: imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            return data;
        },

        onSuccess: () => {
            toast.success(editId ? "Product updated successfully" : "Product added successfully");
            setForm({ name: "", price: "", description: "", image: "" });
            setEditId(null);
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error) => {
            toast.error(error.message || "Failed to save product");
        },
    });
    const deleteProduct = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card >
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                </CardHeader>

                <CardContent >
                    <div className="space-y-2">
                        <Label>Product Name</Label>

                        <Input
                            value={form.name}
                            onChange={(e) => {
                                setForm({ ...form, name: e.target.value });
                                setErrors({ ...errors, name: "" });
                            }}
                            placeholder="Enter product name"
                        />

                        <p className="min-h-[20px] text-sm text-red-500">
                            {errors.name}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Price</Label>

                        <Input
                            type="number"
                            value={form.price}
                            onChange={(e) => {
                                setForm({ ...form, price: e.target.value });
                                setErrors({ ...errors, price: "" });
                            }}
                            placeholder="Enter price"
                        />

                        <p className="min-h-[20px] text-sm text-red-500">
                            {errors.price}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>

                        <Input
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="space-y-2 mt-5">
                        <Label>Product Image</Label>

                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setImage(e.target.files?.[0] || null);
                                setErrors({ ...errors, image: "" });
                            }}
                        />

                        <p className="min-h-[20px] text-sm text-red-500">
                            {errors.image}
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            if (!validate()) return;
                            saveProduct.mutate();
                        }}
                        disabled={saveProduct.isPending}
                        className="w-full mt-2"
                    >
                        {saveProduct.isPending
                            ? "Saving..."
                            : editId
                                ? "Update Product"
                                : "Add Product"}
                    </Button>
                </CardContent>
            </Card>

            <Card className="flex h-[450px] flex-col">
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>


                <CardContent className="flex-1 space-y-3 scroll-hide overflow-y-auto">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No products found.</p>
                    ) : (
                        products.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                        className="h-16 w-16 rounded-md object-cover"
                                    />

                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">${item.price}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setForm({
                                            name: item.name,
                                            price: item.price,
                                            description: item.description || "",
                                            image: item.image || "",
                                        });
                                        setEditId(item.id);
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteProduct.mutate(item.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}