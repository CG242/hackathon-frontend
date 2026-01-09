'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Announcement = {
    id: number;
    title: string;
    content: string;
    date: string;
    scope: 'public' | 'private';
}

interface AnnouncementsContextType {
    announcements: Announcement[];
    addAnnouncement: (announcement: Announcement) => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

const initialAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Bienvenue au Hackathon 2026!",
        content: "Nous sommes ravis de vous accueillir. Que le meilleur gagne !",
        date: "2026-01-01",
        scope: "public",
    },
    {
        id: 2,
        title: "Rappel : Cérémonie d'ouverture",
        content: "N'oubliez pas la cérémonie d'ouverture à 9h précises dans l'amphithéâtre principal.",
        date: "2026-01-01",
        scope: "public",
    },
    {
        id: 3,
        title: "Briefing des mentors (Privé)",
        content: "Rendez-vous à 8h30 pour le briefing des mentors dans la salle 101.",
        date: "2026-01-01",
        scope: "private",
    }
];

export const AnnouncementsProvider = ({ children }: { children: ReactNode }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

    const addAnnouncement = (announcement: Announcement) => {
        setAnnouncements(prevAnnouncements => [announcement, ...prevAnnouncements]);
    };

    return (
        <AnnouncementsContext.Provider value={{ announcements, addAnnouncement }}>
            {children}
        </AnnouncementsContext.Provider>
    );
};

export const useAnnouncements = () => {
    const context = useContext(AnnouncementsContext);
    if (context === undefined) {
        throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
    }
    return context;
};
