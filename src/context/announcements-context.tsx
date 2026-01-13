'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { annoncesApi, Annonce } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

interface AnnouncementsContextType {
  announcements: Annonce[];
  loading: boolean;
  refreshAnnouncements: () => Promise<void>;
  createAnnouncement: (data: { titre: string; contenu: string; cible: 'PUBLIC' | 'INSCRITS'; hackathonId?: string }) => Promise<Annonce>;
  updateAnnouncement: (id: string, data: Partial<Annonce>) => Promise<Annonce>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export const AnnouncementsProvider = ({ children }: { children: ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      // Si l'utilisateur est admin, charger toutes les annonces (publiques et privées)
      // Sinon, charger seulement les annonces publiques
      const data = user?.role === 'ADMIN'
        ? await annoncesApi.getAllAnnonces()
        : await annoncesApi.getPublicAnnonces();

      if (user?.role === 'ADMIN' && data) {
        const publicCount = data.filter(a => a.cible === 'PUBLIC').length;
        const privateCount = data.filter(a => a.cible === 'INSCRITS').length;
      }

      setAnnouncements(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les annonces.',
      });
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        load();
      } else {
        setLoading(false);
        setAnnouncements([]);
      }
    }
  }, [user, authLoading]);

  const refreshAnnouncements = async () => {
    await load();
  };

  const createAnnouncement = async (data: { titre: string; contenu: string; cible: 'PUBLIC' | 'INSCRITS'; hackathonId?: string }) => {
    try {
      const newAnnonce = await annoncesApi.createAnnonce(data);
      await load();
      toast({
        title: 'Annonce créée',
        description: `L'annonce a été ${data.cible === 'PUBLIC' ? 'publiée' : 'créée (privée)'} avec succès.`,
      });
      return newAnnonce;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || "Impossible de créer l'annonce.",
      });
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, data: Partial<Annonce>) => {
    try {
      const updated = await annoncesApi.updateAnnonce(id, data);
      await load();
      toast({
        title: 'Annonce mise à jour',
        description: `L'annonce a été ${data.cible === 'PUBLIC' ? 'rendue publique' : 'rendue privée'} avec succès.`,
      });
      return updated;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || "Impossible de mettre à jour l'annonce.",
      });
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await annoncesApi.deleteAnnonce(id);
      await load();
      toast({
        title: 'Annonce supprimée',
        description: "L'annonce a été supprimée avec succès.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || "Impossible de supprimer l'annonce.",
      });
      throw error;
    }
  };

  return (
    <AnnouncementsContext.Provider value={{ announcements, loading, refreshAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement }}>
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext);
  if (!context) throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  return context;
};
 