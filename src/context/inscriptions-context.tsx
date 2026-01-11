'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { adminApi, inscriptionsApi, Inscription } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type InscriptionUpdatePayload = {
  statut?: Inscription['statut'];
  promo?: string;
  technologies?: any;
};

interface InscriptionsContextType {
  inscriptions: Inscription[];
  loading: boolean;
  refreshInscriptions: () => Promise<void>;
  updateInscription: (id: string, data: InscriptionUpdatePayload) => Promise<void>;
  deleteInscription: (id: string) => Promise<void>;
}

const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined);

export const InscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = (user?.role ?? '').toUpperCase() === 'ADMIN';

  const loadInscriptions = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const adminList = await adminApi.getAllInscriptions();
        setInscriptions(adminList);
      } else if (user) {
        const personal = await inscriptionsApi.getMyInscriptions();
        setInscriptions(personal);
      } else {
        setInscriptions([]);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les inscriptions.',
      });
      setInscriptions([]);
    } finally {
      setLoading(false);
                }
  };

  useEffect(() => {
    if (user) {
      loadInscriptions();
    } else {
      setInscriptions([]);
      setLoading(false);
    }
  }, [user]);

  const refreshInscriptions = async () => {
    await loadInscriptions();
  };

  const updateInscription = async (id: string, data: InscriptionUpdatePayload) => {
    if (!isAdmin) {
      throw new Error('Seuls les administrateurs peuvent modifier les inscriptions');
    }
    await adminApi.updateInscription(id, data);
    await loadInscriptions();
    toast({
      title: 'Inscription mise à jour',
      description: 'Les modifications ont été enregistrées.',
        });
    };

  const deleteInscription = async (id: string) => {
    if (isAdmin) {
      await adminApi.deleteInscription(id);
      setInscriptions((prev) => prev.filter((ins) => ins.id !== id));
      toast({
        title: 'Inscription supprimée',
        description: 'L\'inscription a été supprimée avec succès.',
      });
      return;
    }
    await inscriptionsApi.deleteInscription(id);
    setInscriptions((prev) => prev.filter((ins) => ins.id !== id));
    toast({
      title: 'Inscription supprimée',
      description: 'Votre inscription a été supprimée.',
        });
  };

    return (
    <InscriptionsContext.Provider
      value={{ inscriptions, loading, refreshInscriptions, updateInscription, deleteInscription }}
    >
            {children}
        </InscriptionsContext.Provider>
    );
};

export const useInscriptions = () => {
    const context = useContext(InscriptionsContext);
  if (!context) {
    throw new Error('useInscriptions must be used within an InscriptionsProvider');
    }
    return context;
};
