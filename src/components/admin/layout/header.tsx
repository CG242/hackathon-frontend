'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAnnouncements } from '@/context/announcements-context';
import { useAuth } from '@/context/auth-context';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const { announcements } = useAnnouncements();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

  const displayName =
    user && (user.prenom || user.nom)
      ? `${user.nom ?? ''} ${user.prenom ?? ''}`.trim()
      : user?.email || 'Admin';

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('readNotifications');
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        setReadNotificationIds(new Set(ids));
      } catch (error) {
      }
    }
  }, []);

  const unreadAnnouncements = announcements.filter((a) => !readNotificationIds.has(a.id));
  const unreadCount = unreadAnnouncements.length;

  const markAsRead = (announcementId: string) => {
    setReadNotificationIds((state) => {
      const next = new Set(state);
      next.add(announcementId);
      localStorage.setItem('readNotifications', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const markAllAsRead = () => {
    const allIds = new Set(announcements.map((a) => a.id));
    setReadNotificationIds(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(allIds)));
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-6 border-b bg-background/80 px-4 lg:px-8">
      <SidebarTrigger className="md:hidden" />
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Recherche globale..." className="pl-10 w-full" />
      </div>

      <div className="flex items-center gap-4">
        {isClient && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 text-[10px] leading-4">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {announcements.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">Aucune notification</div>
              )}
              {announcements.map((announcement) => (
                <DropdownMenuItem
                  key={announcement.id}
                  onClick={() => {
                    markAsRead(announcement.id);
                    if (announcement.cible === 'PUBLIC') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex flex-col gap-1 text-sm"
                >
                  <span className="font-semibold">{announcement.titre}</span>
                  <span className="text-muted-foreground text-xs">{announcement.createdAt}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Mon profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
 