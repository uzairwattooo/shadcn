import Link from "next/link";
import { Globe, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-slate-950 text-slate-300">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
                <div>
                    <h3 className="text-xl font-bold text-white">Marketplace</h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        Multi-vendor marketplace powered by Stripe Connect. Secure payments,
                        automatic seller payouts, and platform commission.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                    <Link
                        href="/"
                        className="transition hover:text-cyan-400"
                    >
                        Home
                    </Link>

                    <Link
                        href="/customer"
                        className="transition hover:text-cyan-400"
                    >
                        Shop
                    </Link>

                    <Link
                        href="/auth/signup"
                        className="transition hover:text-cyan-400"
                    >
                        Become a Seller
                    </Link>

                    <Link
                        href="/dashboard"
                        className="transition hover:text-cyan-400"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 text-sm md:flex-row">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-cyan-400" />
                        <span>Secure payments powered by Stripe</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link
                            href="mailto:support@example.com"
                            className="transition hover:text-cyan-400"
                        >
                            <Mail className="h-5 w-5" />
                        </Link>

                        <Link
                            href="https://github.com"
                            target="_blank"
                            className="transition hover:text-cyan-400"
                        >
                            <Globe className="h-5 w-5" />
                        </Link>
                    </div>

                    <p className="text-slate-500">
                        © {new Date().getFullYear()} Marketplace. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}