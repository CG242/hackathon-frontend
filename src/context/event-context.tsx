'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { hackathonApi, Hackathon } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface EventSettings {
    eventName: string;
    registrationsOpen: boolean;
    registrationGoal: number;
    countdownEnabled: boolean;
    currentRegistrations?: number;
    prizes: {
        first: string;
        second: string;
        third: string;
  };
}

interface EventContextType {
    eventSettings: EventSettings;
    setEventSettings: React.Dispatch<React.SetStateAction<EventSettings>>;
  hackathon: Hackathon | null;
    loading: boolean;
  refreshHackathon: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const defaultSettings: EventSettings = {
  eventName: 'Hackathon CFI-CIRAS',
    registrationsOpen: true,
    registrationGoal: 300,
    countdownEnabled: true,
    currentRegistrations: 0,
    prizes: {
    first: '150 000 FCFA',
    second: '100 000 FCFA',
    third: '50 000 FCFA',
  },
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [eventSettings, setEventSettings] = useState<EventSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eventSettings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
        }
      }
    }
    return defaultSettings;
  });
    const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadHackathon = async () => {
        try {
      setLoading(true);
      const data = await hackathonApi.getPublicHackathon();
      setHackathon(data);
      setEventSettings({
        eventName: data.nom,
        registrationsOpen: data.status === 'UPCOMING' || data.status === 'ONGOING',
        registrationGoal: data.registrationGoal ?? defaultSettings.registrationGoal,
        countdownEnabled: defaultSettings.countdownEnabled,
        currentRegistrations: data.currentRegistrations ?? defaultSettings.currentRegistrations,
        prizes: defaultSettings.prizes,
      });
    } catch (error: any) {
      setHackathon(null);
      setEventSettings(defaultSettings);
      if (!error.message?.includes('404')) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les informations du hackathon.',
        });
        }
    } finally {
        setLoading(false);
    }
  };

    useEffect(() => {
    loadHackathon();
  }, []);

  // Sauvegarder les paramètres dans localStorage
  useEffect(() => {
    localStorage.setItem('eventSettings', JSON.stringify(eventSettings));
  }, [eventSettings]);

  const refreshHackathon = async () => {
    await loadHackathon();
  };

    return (
    <EventContext.Provider value={{ eventSettings, setEventSettings, hackathon, loading, refreshHackathon }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);
  if (!context) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
