'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { teamsApi, Team } from '@/lib/api';
import { useEvent } from './event-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  refreshTeams: () => Promise<void>;
  createTeam: (data: { nom: string; description?: string; projetNom?: string }) => Promise<Team>;
  updateTeam: (teamId: string, data: { nom?: string; description?: string; projetNom?: string }) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMemberToTeam: (teamId: string, userId: string, role?: string) => Promise<void>;
  removeMemberFromTeam: (teamId: string, userId: string) => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { hackathon } = useEvent();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = (user?.role ?? '').toUpperCase() === 'ADMIN';

  const loadTeams = async () => {
    if (!hackathon?.id) {
      setTeams([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      if (isAdmin) {
        const data = await teamsApi.getTeamsByHackathon(hackathon.id);
        setTeams(data || []);
      } else {
        // En mode public, ne pas appeler l'endpoint admin protégé.
        const data = await teamsApi.getPublicTeams();
        const filtered = (data || []).filter((t) => t.hackathonId === hackathon.id);
        setTeams(filtered);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les équipes.',
      });
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, [hackathon?.id, isAdmin]);

  const refreshTeams = async () => {
    await loadTeams();
  };

  const createTeam = async (data: { nom: string; description?: string; projetNom?: string }) => {
    if (!isAdmin) throw new Error('Seuls les administrateurs peuvent créer une équipe');
    if (!hackathon?.id) throw new Error('Aucun hackathon actif');
    const created = await teamsApi.createTeam(hackathon.id, data);
    await loadTeams();
    toast({ title: 'Équipe créée', description: 'L’équipe a été créée.' });
    return created;
  };

  const updateTeam = async (teamId: string, data: { nom?: string; description?: string; projetNom?: string }) => {
    if (!isAdmin) throw new Error('Seuls les administrateurs peuvent modifier une équipe');
    const updated = await teamsApi.updateTeam(teamId, data);
    await loadTeams();
    toast({ title: 'Équipe mise à jour', description: 'Les modifications sont enregistrées.' });
    return updated;
  };

  const deleteTeam = async (teamId: string) => {
    if (!isAdmin) throw new Error('Seuls les administrateurs peuvent supprimer une équipe');
    await teamsApi.deleteTeam(teamId);
    await loadTeams();
    toast({ title: 'Équipe supprimée', description: 'L’équipe a été supprimée.' });
  };

  const addMemberToTeam = async (teamId: string, userId: string, role?: string) => {
    if (!isAdmin) throw new Error('Seuls les administrateurs peuvent ajouter un membre');
    await teamsApi.addMemberToTeam(teamId, userId, role);
    await loadTeams();
    toast({ title: 'Membre ajouté', description: 'Le membre a été ajouté.' });
  };

  const removeMemberFromTeam = async (teamId: string, userId: string) => {
    if (!isAdmin) throw new Error('Seuls les administrateurs peuvent retirer un membre');
    await teamsApi.removeMemberFromTeam(teamId, userId);
    await loadTeams();
    toast({ title: 'Membre retiré', description: 'Le membre a été retiré.' });
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        loading,
        refreshTeams,
        createTeam,
        updateTeam,
        deleteTeam,
        addMemberToTeam,
        removeMemberFromTeam,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) throw new Error('useTeams must be used within a TeamsProvider');
  return context;
};
 