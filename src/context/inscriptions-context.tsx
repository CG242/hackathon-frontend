'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type InscriptionStatus = 'En attente' | 'Accepté' | 'Rejeté';

export type Inscription = {
    id: string;
    fullName: string;
    email: string;
    classe: string;
    date: string;
    status: InscriptionStatus;
};

interface InscriptionsContextType {
    inscriptions: Inscription[];
    addInscription: (inscriptionData: Omit<Inscription, 'id' | 'date' | 'status'>) => void;
    updateInscription: (id: string, updatedData: Partial<Omit<Inscription, 'id'>>) => void;
    loading: boolean;
}

const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined);

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const InscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedInscriptions = localStorage.getItem('inscriptions');
            if (storedInscriptions) {
                const parsedInscriptions: Inscription[] = JSON.parse(storedInscriptions);
                // Ensure all inscriptions have a unique ID
                const inscriptionsWithIds = parsedInscriptions.map(inscription => ({
                    ...inscription,
                    id: inscription.id || generateUniqueId()
                }));
                const uniqueInscriptions = Array.from(new Map(inscriptionsWithIds.map(item => [item.id, item])).values());
                setInscriptions(uniqueInscriptions);
                 if (uniqueInscriptions.length !== parsedInscriptions.length) {
                    localStorage.setItem('inscriptions', JSON.stringify(uniqueInscriptions));
                }
            }
        } catch (error) {
            localStorage.removeItem('inscriptions');
        }
        setLoading(false);
    }, []);

    const addInscription = (inscriptionData: Omit<Inscription, 'id' | 'date' | 'status'>) => {
        const newInscription: Inscription = {
            ...inscriptionData,
            id: generateUniqueId(),
            date: new Date().toISOString(),
            status: "En attente",
        };
        setInscriptions(prevInscriptions => {
            const updatedInscriptions = [newInscription, ...prevInscriptions];
            localStorage.setItem('inscriptions', JSON.stringify(updatedInscriptions));
            return updatedInscriptions;
        });
    };

    const updateInscription = (id: string, updatedData: Partial<Omit<Inscription, 'id'>>) => {
        setInscriptions(prevInscriptions => {
            const updatedInscriptions = prevInscriptions.map(inscription => 
                inscription.id === id ? { ...inscription, ...updatedData } : inscription
            );
            localStorage.setItem('inscriptions', JSON.stringify(updatedInscriptions));
            return updatedInscriptions;
        });
    }

    return (
        <InscriptionsContext.Provider value={{ inscriptions, addInscription, updateInscription, loading }}>
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
