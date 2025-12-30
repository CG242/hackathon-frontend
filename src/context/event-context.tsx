'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EventSettings {
    eventName: string;
    eventDate: string;
    registrationsOpen: boolean;
}

interface EventContextType {
    eventSettings: EventSettings;
    setEventSettings: (settings: EventSettings) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialSettings: EventSettings = {
    eventName: "Hackathon 2026",
    eventDate: "2026-01-01T09:00",
    registrationsOpen: true,
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [eventSettings, setEventSettingsState] = useState<EventSettings>(initialSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('event_settings');
            if (storedSettings) {
                setEventSettingsState(JSON.parse(storedSettings));
            } else {
                localStorage.setItem('event_settings', JSON.stringify(initialSettings));
            }
        } catch (error) {
            console.error("Failed to parse event settings from localStorage", error);
            localStorage.removeItem('event_settings');
        }
        setLoading(false);
    }, []);

    const setEventSettings = (newSettings: EventSettings) => {
        localStorage.setItem('event_settings', JSON.stringify(newSettings));
        setEventSettingsState(newSettings);
    };

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <EventContext.Provider value={{ eventSettings, setEventSettings }}>
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
