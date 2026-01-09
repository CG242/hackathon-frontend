'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { resultatsApi } from '@/lib/api';

interface Winners {
  first: string;
  second: string;
  third: string;
}

interface WinnersContextType {
  winners: Winners;
  setWinners: (winners: Winners) => void;
  areResultsPublished: boolean;
  publishResults: (published: boolean) => void;
  preselected: string[];
  setPreselected: (preselected: string[]) => void;
  arePreselectionsPublished: boolean;
  publishPreselections: (published: boolean) => void;
  loading: boolean;
  refreshResultats: () => Promise<void>;
}

const WinnersContext = createContext<WinnersContextType | undefined>(undefined);

const initialWinners: Winners = {
  first: 'none',
  second: 'none',
  third: 'none',
};

export const WinnersProvider = ({ children }: { children: ReactNode }) => {
  const [winners, setWinnersState] = useState<Winners>(initialWinners);
  const [areResultsPublished, setAreResultsPublished] = useState(false);
  const [preselected, setPreselectedState] = useState<string[]>([]);
  const [arePreselectionsPublished, setArePreselectionsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hackathonId, setHackathonId] = useState<string | null>(null);

  const refreshResultats = async (hackathonIdToUse?: string | null) => {
    // Toujours utiliser la route publique pour récupérer les résultats
    // La route publique retourne les résultats du hackathon le plus récent
    try {
      const publicResultats = await resultatsApi.getPublicResultats();
      setWinnersState({
        first: publicResultats.premierPlace || 'none',
        second: publicResultats.deuxiemePlace || 'none',
        third: publicResultats.troisiemePlace || 'none',
      });
      setAreResultsPublished(publicResultats.podiumPublie || false);
      setPreselectedState(Array.isArray(publicResultats.preselectionnes) ? publicResultats.preselectionnes : []);
      setArePreselectionsPublished(publicResultats.preselectionsPubliees || false);
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Erreur inconnue';
      const errorDetails = error?.data || {};
      const statusCode = error?.statusCode || error?.status;
      
      console.error('Erreur lors de la récupération des résultats publics:', {
        message: errorMessage,
        details: errorDetails,
        status: statusCode,
        fullError: error
      });
      
      // En cas d'erreur, on garde les valeurs par défaut
      setWinnersState(initialWinners);
      setAreResultsPublished(false);
      setPreselectedState([]);
      setArePreselectionsPublished(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Essayer de récupérer le hackathon actuel depuis l'API
      try {
        const { hackathonApi } = await import('@/lib/api');
        const hackathon = await hackathonApi.getPublicHackathon();
        setHackathonId(hackathon.id);
      } catch (error) {
        console.error('Erreur lors de la récupération du hackathon:', error);
      }
      
      // Toujours récupérer les résultats publics (route publique)
      await refreshResultats();
      setLoading(false);
    };

    loadData();
  }, []);

  const setWinners = async (newWinners: Winners) => {
    setWinnersState(newWinners);
    // Sauvegarder dans le backend si on a un hackathon
    if (hackathonId) {
      try {
        await resultatsApi.publishPodium(hackathonId, {
          premierPlace: newWinners.first !== 'none' ? newWinners.first : undefined,
          deuxiemePlace: newWinners.second !== 'none' ? newWinners.second : undefined,
          troisiemePlace: newWinners.third !== 'none' ? newWinners.third : undefined,
        });
        setAreResultsPublished(true);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des gagnants:', error);
      }
    }
  };

  const publishResults = async (published: boolean) => {
    setAreResultsPublished(published);
    if (hackathonId) {
      try {
        if (published) {
          // Publier avec les gagnants actuels
          await resultatsApi.publishPodium(hackathonId, {
            premierPlace: winners.first !== 'none' ? winners.first : undefined,
            deuxiemePlace: winners.second !== 'none' ? winners.second : undefined,
            troisiemePlace: winners.third !== 'none' ? winners.third : undefined,
          });
        } else {
          // Dépublier
          await resultatsApi.unpublishPodium(hackathonId);
        }
      } catch (error) {
        console.error('Erreur lors de la publication/dépublication:', error);
      }
    }
  };
  
  const setPreselected = async (newPreselected: string[]) => {
    setPreselectedState(newPreselected);
    // Sauvegarder dans le backend si on a un hackathon
    if (hackathonId) {
      try {
        await resultatsApi.publishPreselections(hackathonId, newPreselected);
        setArePreselectionsPublished(true);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des présélectionnés:', error);
      }
    }
  };

  const publishPreselections = async (published: boolean) => {
    setArePreselectionsPublished(published);
    if (hackathonId) {
      try {
        if (published) {
          // Publier avec les présélectionnés actuels
          await resultatsApi.publishPreselections(hackathonId, preselected);
        } else {
          // Dépublier
          await resultatsApi.unpublishPreselections(hackathonId);
        }
      } catch (error) {
        console.error('Erreur lors de la publication/dépublication des présélections:', error);
      }
    }
  };

  return (
    <WinnersContext.Provider value={{ 
        winners, setWinners, areResultsPublished, publishResults,
        preselected, setPreselected, arePreselectionsPublished, publishPreselections,
        loading, refreshResultats
    }}>
      {children}
    </WinnersContext.Provider>
  );
};

export const useWinners = () => {
  const context = useContext(WinnersContext);
  if (context === undefined) {
    throw new Error('useWinners must be used within a WinnersProvider');
  }
  return context;
};
