'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface EventSettings {
    eventName: string;
    eventDate: string;
    registrationsOpen: boolean;
    registrationGoal: number;
    prizes: {
        first: string;
        second: string;
        third: string;
    }
}

interface EventContextType {
    eventSettings: EventSettings;
    setEventSettings: React.Dispatch<React.SetStateAction<EventSettings>>;
    loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialSettings: EventSettings = {
    eventName: "Hackathon CFI-CIRAS",
    eventDate: "2026-01-01T09:00",
    registrationsOpen: true,
    registrationGoal: 300,
    prizes: {
        first: "150 000 FCFA",
        second: "100 000 FCFA",
        third: "50 000 FCFA",
    }
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [eventSettings, setEventSettings] = useState<EventSettings>(initialSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('event_settings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                const mergedSettings = {
                    ...initialSettings,
                    ...parsedSettings,
                    prizes: {
                        ...initialSettings.prizes,
                        ...(parsedSettings.prizes || {}),
                    }
                };
                setEventSettings(mergedSettings);
            }
        } catch (error) {
            console.error("Failed to parse event settings from localStorage", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('event_settings', JSON.stringify(eventSettings));
            } catch (error) {
                console.error("Failed to save event settings to localStorage", error);
            }
        }
    }, [eventSettings, loading]);

    if (loading) {
        return null;
    }

    return (
        <EventContext.Provider value={{ eventSettings, setEventSettings, loading }}>
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
