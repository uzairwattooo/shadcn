"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Login", href: "/auth/login" },
        { name: "Signup", href: "/auth/signup" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    MyApp
                </Link>

                <nav className="flex items-center gap-2">
                    {links.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Button
                                key={link.href}
                                asChild
                                variant={active ? "default" : "ghost"}
                            >
                                <Link href={link.href}>{link.name}</Link>
                            </Button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}