'use client';

import AdminHeader from "@/components/admin/layout/header";
import AdminSidebar from "@/components/admin/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BackgroundParticles from "@/components/background-particles";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  if (isChecking || loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <SidebarProvider>
        <div className="relative flex min-h-screen w-full">
            <BackgroundParticles />
            <AdminSidebar />
            <div className="flex flex-col flex-1 z-10">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}
