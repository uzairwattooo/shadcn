"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Settings,
    LogOut,
} from "lucide-react";

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
    return (
        <Sidebar className="mt-16">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold">
                        Admin Panel
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}