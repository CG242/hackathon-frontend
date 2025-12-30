'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type Inscription } from '@/components/registration-form';

interface InscriptionsContextType {
    inscriptions: Inscription[];
    addInscription: (inscription: Inscription) => void;
}

const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined);

const initialInscriptions: Inscription[] = [
    {
        fullName: "John Doe",
        email: "john.doe@example.com",
        classe: "LIC2 A",
        date: "2023-10-26T10:00:00Z"
    },
    {
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        classe: "LRT B",
        date: "2023-10-25T14:30:00Z"
    }
];

export const InscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>(initialInscriptions);

    const addInscription = (inscription: Inscription) => {
        setInscriptions(prevInscriptions => [inscription, ...prevInscriptions]);
    };

    return (
        <InscriptionsContext.Provider value={{ inscriptions, addInscription }}>
            {children}
        </InscriptionsContext.Provider>
    );
};

export const useInscriptions = () => {
    const context = useContext(InscriptionsContext);
    if (context === undefined) {
        throw new Error('useInscriptions must be used within an InscriptionsProvider');
    }
    return context;
};
