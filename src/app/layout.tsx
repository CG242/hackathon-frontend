import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { InscriptionsProvider } from '@/context/inscriptions-context';
import { AuthProvider } from '@/context/auth-context';
import { EventProvider } from '@/context/event-context';

export const metadata: Metadata = {
  title: 'Hackathon 2026 | CFI-CIRAS',
  description: 'The premium, immersive website for Hackathon 2026 by CFI-CIRAS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <AuthProvider>
          <InscriptionsProvider>
            <EventProvider>
              {children}
            </EventProvider>
          </InscriptionsProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
