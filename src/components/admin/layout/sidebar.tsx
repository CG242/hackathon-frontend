"use client";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Megaphone,
    Bot,
    LineChart,
    History,
    Settings,
    BookText,
    LogOut,
    CodeXml,
    Award,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useInscriptions } from "@/context/inscriptions-context";

const bottomNavItems = [
    { href: "/admin/settings", label: "Configuration", icon: Settings },
    { href: "/admin/docs", label: "Documentation", icon: BookText },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { inscriptions } = useInscriptions();

    const navItems = [
        { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/admin/inscriptions", label: "Inscriptions", icon: Users, badge: inscriptions.length > 0 ? String(inscriptions.length) : undefined },
        { href: "/admin/projects", label: "Projets & Équipes", icon: FolderKanban },
        { href: "/admin/announcements", label: "Annonces", icon: Megaphone },
        { href: "/admin/results", label: "Résultats", icon: Award },
        { href: "/admin/ai-module", label: "Module IA", icon: Bot },
        { href: "/admin/monitoring", label: "Monitoring", icon: LineChart },
        { href: "/admin/past-hackathons", label: "Hackathons Passés", icon: History },
    ];


    return (
        <Sidebar collapsible="icon" side="left" variant="sidebar">
            <SidebarHeader className="h-20 justify-center">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">
                    <CodeXml className="w-7 h-7 text-primary" />
                    <span>CFI-CIRAS</span>
                </Link>
                <Link href="/" className="items-center gap-2 text-xl font-bold font-headline hidden group-data-[collapsible=icon]:flex">
                    <CodeXml className="w-7 h-7 text-primary" />
                </Link>
                <Badge variant="outline" className="border-primary text-primary group-data-[collapsible=icon]:hidden">Admin</Badge>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={{ children: item.label }}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                    {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {bottomNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={{ children: item.label }}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                         <SidebarMenuButton onClick={logout} tooltip={{ children: "Déconnexion" }}>
                            <LogOut />
                            <span>Déconnexion</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
