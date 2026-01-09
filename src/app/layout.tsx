import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { InscriptionsProvider } from '@/context/inscriptions-context';
import { AuthProvider } from '@/context/auth-context';
import { EventProvider } from '@/context/event-context';
import { AnnouncementsProvider } from '@/context/announcements-context';
import { ProjectsProvider } from '@/context/projects-context';
import { WinnersProvider } from '@/context/winners-context';

export const metadata: Metadata = {
  title: 'Hackathon 2026 | CFI-CIRAS',
  description: 'Le site immersif et premium du Hackathon 2026 par CFI-CIRAS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <AuthProvider>
          <EventProvider>
            <InscriptionsProvider>
              <AnnouncementsProvider>
                <ProjectsProvider>
                  <WinnersProvider>
                    {children}
                  </WinnersProvider>
                </ProjectsProvider>
              </AnnouncementsProvider>
            </InscriptionsProvider>
          </EventProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
