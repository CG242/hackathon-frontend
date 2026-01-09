'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { hackathonApi, Hackathon } from '@/lib/api';

interface EventSettings {
    eventName: string;
    eventDate: string;
    registrationsOpen: boolean;
    registrationGoal: number;
}

interface EventContextType {
    eventSettings: EventSettings;
    hackathon: Hackathon | null;
    setEventSettings: (settings: EventSettings) => void;
    refreshHackathon: () => Promise<void>;
    loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialSettings: EventSettings = {
    eventName: "Hackathon 2026",
    eventDate: "2026-01-01T09:00",
    registrationsOpen: true,
    registrationGoal: 300,
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [eventSettings, setEventSettingsState] = useState<EventSettings>(initialSettings);
    const [hackathon, setHackathon] = useState<Hackathon | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshHackathon = async () => {
        try {
            const data = await hackathonApi.getPublicHackathon();
            setHackathon(data);
            
            // Mettre à jour les settings avec les données du hackathon
            setEventSettingsState({
                eventName: data.nom,
                eventDate: typeof data.dateDebut === 'string' ? data.dateDebut : data.dateDebut.toISOString(),
                registrationsOpen: data.status !== 'PAST',
                registrationGoal: data.nombreInscriptions || 300,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du hackathon:', error);
            // En cas d'erreur, on garde les settings par défaut
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Charger les settings depuis localStorage si disponibles
                const storedSettings = localStorage.getItem('event_settings');
                if (storedSettings) {
                    const parsedSettings = JSON.parse(storedSettings);
                    setEventSettingsState({ ...initialSettings, ...parsedSettings });
                }

                // Récupérer le hackathon actuel depuis l'API
                await refreshHackathon();
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const setEventSettings = (newSettings: EventSettings) => {
        localStorage.setItem('event_settings', JSON.stringify(newSettings));
        setEventSettingsState(newSettings);
    };

    return (
        <EventContext.Provider value={{ eventSettings, hackathon, setEventSettings, refreshHackathon, loading }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
