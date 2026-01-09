'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { inscriptionsApi, Inscription } from '@/lib/api';
import { useAuth } from './auth-context';

interface InscriptionsContextType {
    inscriptions: Inscription[];
    loading: boolean;
    refreshInscriptions: () => Promise<void>;
}

const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined);

export const InscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const refreshInscriptions = async () => {
        if (!user) {
            setInscriptions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Si l'utilisateur est admin, récupérer toutes les inscriptions
            // Sinon, récupérer seulement ses inscriptions
            let data: Inscription[];
            if (user.role === 'ADMIN') {
                const { adminApi } = await import('@/lib/api');
                data = await adminApi.getAllInscriptions();
            } else {
                data = await inscriptionsApi.getMyInscriptions();
            }
            setInscriptions(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des inscriptions:', error);
            setInscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshInscriptions();
    }, [user]);

    return (
        <InscriptionsContext.Provider value={{ inscriptions, loading, refreshInscriptions }}>
            {children}
        </InscriptionsContext.Provider>
    );
};

export const useInscriptions = () => {
    const context = useContext(InscriptionsContext);
    if (context === undefined) {
        throw new Error('useInscriptions doit être utilisé dans un InscriptionsProvider');
    }
    return context;
};
