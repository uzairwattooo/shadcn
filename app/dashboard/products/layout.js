import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProductsLayout({ children }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/auth/login");
    }

    if (!["admin", "seller"].includes(session.user.role)) {
        redirect("/dashboard");
    }

    return children;
}