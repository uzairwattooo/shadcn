import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <SidebarProvider>
            <AppSidebar user={session.user}/>

            <main className="w-full bg-muted/40">
                <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>

                <div className="p-6">{children}</div>
            </main>
        </SidebarProvider>
    );
}