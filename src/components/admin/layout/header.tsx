'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { useAnnouncements } from "@/context/announcements-context";

export default function AdminHeader() {
    const { logout, user } = useAuth();
    const { announcements } = useAnnouncements();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const unreadNotifications = announcements.length;

    return (
        <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-8">
            <SidebarTrigger className="md:hidden" />
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Recherche globale..."
                    className="w-full max-w-sm pl-9"
                />
            </div>
            {isClient && <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {unreadNotifications > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-[10px]">{unreadNotifications}</Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3).map(announcement => (
                           <DropdownMenuItem key={announcement.id} asChild>
                               <Link href="/admin/announcements" className="flex flex-col items-start">
                                   <span className="font-semibold">{announcement.title}</span>
                                   <span className="text-xs text-muted-foreground">{announcement.content.substring(0, 30)}...</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                         {announcements.length === 0 && <DropdownMenuItem>Aucune nouvelle notification</DropdownMenuItem>}
                         {announcements.length > 3 && <DropdownMenuItem asChild><Link href="/admin/announcements" className="text-primary text-center w-full justify-center">Voir toutes</Link></DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Profil</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings">Paramètres</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                             <Link href="/admin/monitoring">Logs d'activité</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>}
        </header>
    );
}
