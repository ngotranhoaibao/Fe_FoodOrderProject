import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter 
} from "@/components/ui/sidebar";
import { IconLayoutDashboard, IconFileInvoice, IconLogout } from "@tabler/icons-react"; 
import { Button } from "@/components/ui/button"; 
import {logoutUser} from "../../services/api/auth";
const items = [
    {
        title: "Food Management",
        path: "/",
        icon: IconLayoutDashboard,
    },
    {
        title: "Order Management",
        path: "/orders",
        icon: IconFileInvoice,
    },
];

export default function AppSidebar() {
    const location = useLocation();

     const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.href = "/sign-in";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <Sidebar className="flex flex-col h-full">
            <SidebarContent className="flex-1 flex flex-col">
                <SidebarGroup className="flex-1 flex flex-col">
                                        <div className="p-6 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-utensils-crossed w-5 h-5 text-primary-foreground"
                                >
                                    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
                                    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
                                    <path d="m2.1 21.8 6.4-6.3"></path>
                                    <path d="m19 5-7 7"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-foreground">FoodOrder</h1>
                                <p className="text-xs text-muted-foreground">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            data-slot="button"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 size-9 lg:hidden"
                            aria-label="close sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-x w-5 h-5"
                            >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <SidebarGroupContent className="flex-1 overflow-y-auto p-4 space-y-2"> 
                        <SidebarMenu>
                            {items.map((item) => {
                                const active = item.path === location.pathname;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.path}
                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                                    active
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-foreground hover:bg-secondary"
                                                }`}
                                                aria-current={active ? "page" : undefined}
                                            >
                                                <item.icon className="w-5 h-5" />
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
            
            <SidebarFooter className="p-4 border-t border-border">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:bg-red-50/70 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                >
                    <IconLogout className="w-5 h-5 mr-3" />
                    <span>LOG OUT</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}