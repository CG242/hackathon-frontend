'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { annoncesApi, Annonce } from '@/lib/api';
import { useAuth } from './auth-context';

interface AnnouncementsContextType {
    announcements: Annonce[];
    publicAnnouncements: Annonce[];
    loading: boolean;
    refreshAnnouncements: () => Promise<void>;
    createAnnouncement: (data: { titre: string; contenu: string; cible: 'PUBLIC' | 'INSCRITS'; hackathonId?: string }) => Promise<void>;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export const AnnouncementsProvider = ({ children }: { children: ReactNode }) => {
    const [announcements, setAnnouncements] = useState<Annonce[]>([]);
    const [publicAnnouncements, setPublicAnnouncements] = useState<Annonce[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const refreshAnnouncements = async () => {
        try {
            setLoading(true);
            // Toujours charger les annonces publiques
            const publicData = await annoncesApi.getPublicAnnonces();
            setPublicAnnouncements(publicData);

            // Charger les annonces pour inscrits si l'utilisateur est connecté
            if (user) {
                try {
                    const inscritsData = await annoncesApi.getAnnoncesInscrits();
                    setAnnouncements(inscritsData);
                } catch (error) {
                    // Si l'utilisateur n'est pas inscrit, on garde seulement les publiques
                    setAnnouncements([]);
                }
            } else {
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
            setAnnouncements([]);
            setPublicAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const createAnnouncement = async (data: { titre: string; contenu: string; cible: 'PUBLIC' | 'INSCRITS'; hackathonId?: string }) => {
        try {
            await annoncesApi.createAnnonce(data);
            await refreshAnnouncements();
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
            throw error;
        }
    };

    useEffect(() => {
        refreshAnnouncements();
    }, [user]);

    return (
        <AnnouncementsContext.Provider value={{ 
            announcements, 
            publicAnnouncements, 
            loading, 
            refreshAnnouncements, 
            createAnnouncement 
        }}>
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
