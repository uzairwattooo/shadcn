import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />

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