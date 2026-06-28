"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Settings,
    LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const links = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Products", url: "/dashboard/products", icon: Package },
    { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
    { title: "Customers", url: "/dashboard/customers", icon: Users },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
const logoutMutation = useMutation({
  mutationFn: async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message);
  },

  onSuccess: () => {
    toast.success("Logout successful");
    router.replace("/auth/login");
    router.refresh();
  },

  onError: (error) => {
    toast.error(error.message || "Logout failed");
  },
});
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup  className="mt-16">
                    <SidebarGroupLabel className="text-lg font-bold">
                        Admin Panel
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((item) => {
                                const active = pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={active}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <LogOut />
                            <span>
                                {logoutMutation.isPending ? "Logging out..." : "Logout"}
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}