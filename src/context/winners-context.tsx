'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { resultatsApi, type ResultatsResponse } from '@/lib/api';
import { useEvent } from './event-context';
import { useToast } from '@/hooks/use-toast';

export type Winners = {
  first: string;
  second: string;
  third: string;
};

interface WinnersContextType {
  winners: Winners;
  setWinners: (winners: Winners) => Promise<void>;
  areResultsPublished: boolean;
  publishResults: (published: boolean, winnersToPublish?: Winners) => Promise<void>;
  preselected: string[];
  setPreselected: (preselected: string[]) => Promise<void>;
  arePreselectionsPublished: boolean;
  publishPreselections: (published: boolean, preselectedToPublish?: string[]) => Promise<void>;
  documentPreselectionsName?: string | null;
  documentPreselectionsUrl?: string | null;
  loading: boolean;
  refreshResults: () => Promise<void>;
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
  const [documentPreselectionsName, setDocumentPreselectionsName] = useState<string | null>(null);
  const [documentPreselectionsUrl, setDocumentPreselectionsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { hackathon } = useEvent();
  const { toast } = useToast();

  const loadResults = async () => {
    try {
      setLoading(true);
      // Utiliser getPublicResultats() pour récupérer les résultats du hackathon actuel (accessible publiquement)
      const resultats = await resultatsApi.getPublicResultats();
      
      if (resultats) {
        const winnersState = {
          first: resultats.premierPlace || 'none',
          second: resultats.deuxiemePlace || 'none',
          third: resultats.troisiemePlace || 'none',
        };
        
        setWinnersState(winnersState);
        setAreResultsPublished(resultats.podiumPublie || false);

        if (resultats.preselectionnes) {
          const preselectionnes = Array.isArray(resultats.preselectionnes) 
            ? resultats.preselectionnes 
            : [];
          setPreselectedState(preselectionnes);
        } else {
          setPreselectedState([]);
        }
        setArePreselectionsPublished(resultats.preselectionsPubliees || false);
        
        // Mettre à jour les informations du document PDF
        setDocumentPreselectionsName(resultats.documentPreselectionsName || null);
        setDocumentPreselectionsUrl(resultats.documentPreselectionsUrl || null);
        
      } else {
        // Réinitialiser à l'état par défaut si aucun résultat
        setWinnersState(initialWinners);
        setAreResultsPublished(false);
        setPreselectedState([]);
        setArePreselectionsPublished(false);
        setDocumentPreselectionsName(null);
        setDocumentPreselectionsUrl(null);
      }
    } catch (error: any) {
      // Ne pas afficher d'erreur si c'est juste qu'il n'y a pas de résultats
      if (!error.message?.includes('404')) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les résultats. Vérifiez que le backend est démarré.',
        });
      }
      // En cas d'erreur, réinitialiser à l'état par défaut
      setWinnersState(initialWinners);
      setAreResultsPublished(false);
      setPreselectedState([]);
      setArePreselectionsPublished(false);
      setDocumentPreselectionsName(null);
      setDocumentPreselectionsUrl(null);
    } finally {
    setLoading(false);
      // console.log('📊 Chargement terminé, loading: false');
    }
  };

  useEffect(() => {
    // Charger les résultats une seule fois au montage
    loadResults();
  }, []);

  const refreshResults = async () => {
    await loadResults();
  };

  const setWinners = async (newWinners: Winners) => {
    if (!hackathon?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Aucun hackathon actif.',
      });
      return;
    }

    try {
      // console.log('📢 setWinners - Publication des winners:', newWinners);
      await resultatsApi.publishPodium(hackathon.id, {
        premierPlace: newWinners.first === 'none' ? undefined : newWinners.first,
        deuxiemePlace: newWinners.second === 'none' ? undefined : newWinners.second,
        troisiemePlace: newWinners.third === 'none' ? undefined : newWinners.third,
      });
      
      // Mettre à jour l'état local SANS recharger (pour éviter le refresh)
    setWinnersState(newWinners);
      setAreResultsPublished(true);
      
      // console.log('📢 setWinners - État mis à jour localement');
      
      toast({
        title: 'Podium publié',
        description: 'Les résultats ont été publiés avec succès.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de publier les résultats.',
      });
      throw error;
    }
  };

  const publishResults = async (published: boolean, winnersToPublish?: Winners) => {
    if (!hackathon?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Aucun hackathon actif.',
      });
      return;
    }

    try {
      if (published) {
        // Utiliser les winners fournis ou ceux du contexte
        const winnersToUse = winnersToPublish || winners;
        // console.log('📢 Publication des résultats - Winners à publier:', winnersToUse);
        
        // Vérifier qu'au moins un gagnant est défini avant de publier
        const hasAtLeastOneWinner = winnersToUse.first !== 'none' || winnersToUse.second !== 'none' || winnersToUse.third !== 'none';
        
        if (!hasAtLeastOneWinner) {
          throw new Error('Au moins un gagnant doit être sélectionné pour publier le podium');
        }
        
        // Publier le podium avec les winners spécifiés
        const result = await resultatsApi.publishPodium(hackathon.id, {
          premierPlace: winnersToUse.first === 'none' ? undefined : winnersToUse.first,
          deuxiemePlace: winnersToUse.second === 'none' ? undefined : winnersToUse.second,
          troisiemePlace: winnersToUse.third === 'none' ? undefined : winnersToUse.third,
        });
        
        // console.log('📢 Résultat de la publication API:', result);
        
        // Utiliser la réponse du backend pour mettre à jour l'état
        setWinnersState(winnersToUse);
        // Utiliser podiumPublie de la réponse du backend si disponible, sinon true par défaut
        setAreResultsPublished((result as ResultatsResponse | undefined)?.podiumPublie ?? true);
        
        // console.log('📢 État mis à jour localement - winners:', winnersToUse, 'areResultsPublished:', (result as ResultatsResponse | undefined)?.podiumPublie ?? true);
      } else {
        // Dépublier le podium
        // console.log('📢 Dépublication du podium pour hackathon:', hackathon.id);
        await resultatsApi.unpublishPodium(hackathon.id);
        setAreResultsPublished(false);
        // Ne pas réinitialiser les winners, juste masquer l'affichage
        // console.log('📢 Résultats dépubliés - areResultsPublished: false');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de modifier la publication.',
      });
      throw error;
    }
  };

  const setPreselected = async (newPreselected: string[]) => {
    // Juste mettre à jour l'état local, sans publier automatiquement
    // La publication doit être faite explicitement via publishPreselections
    // console.log('📢 setPreselected - Mise à jour de l\'état local des participants sélectionnés:', newPreselected);
    setPreselectedState(newPreselected);
  };

  const publishPreselections = async (published: boolean, preselectedToPublish?: string[]) => {
    if (!hackathon?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Aucun hackathon actif.',
      });
      return;
    }

    try {
      if (published) {
        // Utiliser les présélectionnés fournis ou ceux du contexte
        const preselectedToUse = preselectedToPublish || preselected;
        // console.log('📢 Publication des présélections - Participants:', preselectedToUse);
        await resultatsApi.publishPreselections(hackathon.id, preselectedToUse);
        
        // Mettre à jour l'état local SANS recharger
        setPreselectedState(preselectedToUse);
        setArePreselectionsPublished(true);
        // console.log('📢 Présélections publiées - arePreselectionsPublished: true');
      } else {
        // console.log('📢 Dépublication des présélections pour hackathon:', hackathon.id);
        await resultatsApi.unpublishPreselections(hackathon.id);
        setArePreselectionsPublished(false);
        // Ne pas réinitialiser les présélectionnés, juste masquer l'affichage
        // console.log('📢 Présélections dépubliées - arePreselectionsPublished: false');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de modifier la publication.',
      });
      throw error;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <WinnersContext.Provider value={{ 
        winners, setWinners, areResultsPublished, publishResults,
        preselected, setPreselected, arePreselectionsPublished, publishPreselections,
        documentPreselectionsName, documentPreselectionsUrl,
        loading, refreshResults
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
