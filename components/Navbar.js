"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Login", href: "/auth/login" },
        { name: "Signup", href: "/auth/signup" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-white"
                >
                    <LayoutDashboard className="h-6 w-6 text-cyan-400" />
                    <span>
                        Admin<span className="text-cyan-400">Panel</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    {links.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Button
                                key={link.href}
                                asChild
                                size="sm"
                                variant="ghost"
                                className={`rounded-full transition-all duration-300 ${active
                                        ? "bg-cyan-500 text-white hover:bg-cyan-600"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}
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