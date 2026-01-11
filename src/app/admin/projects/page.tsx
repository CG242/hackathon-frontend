'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2, UserPlus, X, Eye } from "lucide-react";
import { useTeams } from "@/context/teams-context";
import { useInscriptions } from "@/context/inscriptions-context";
import { useEvent } from "@/context/event-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Team } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsPage() {
    const { teams, loading, createTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam } = useTeams();
    const { inscriptions } = useInscriptions();
    const { hackathon } = useEvent();
    const { toast } = useToast();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDescription, setNewTeamDescription] = useState('');
    const [newTeamProjetNom, setNewTeamProjetNom] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [memberRole, setMemberRole] = useState('');

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Le nom de l\'équipe est requis.',
            });
            return;
        }

        try {
            await createTeam({
                nom: newTeamName.trim(),
                description: newTeamDescription.trim() || undefined,
                projetNom: newTeamProjetNom.trim() || undefined,
            });
            setIsCreateDialogOpen(false);
            setNewTeamName('');
            setNewTeamDescription('');
            setNewTeamProjetNom('');
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        }
    };

    const handleEditTeam = async () => {
        if (!selectedTeam || !newTeamName.trim()) {
            return;
        }

        try {
            await updateTeam(selectedTeam.id, {
                nom: newTeamName.trim(),
                description: newTeamDescription.trim() || undefined,
                projetNom: newTeamProjetNom.trim() || undefined,
            });
            setIsEditDialogOpen(false);
            setSelectedTeam(null);
            setNewTeamName('');
            setNewTeamDescription('');
            setNewTeamProjetNom('');
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        }
    };

    const handleOpenEditDialog = (team: Team) => {
        setSelectedTeam(team);
        setNewTeamName(team.nom);
        setNewTeamDescription(team.description || '');
        setNewTeamProjetNom(team.projetNom || '');
        setIsEditDialogOpen(true);
    };

    const handleAddMember = async () => {
        if (!selectedTeam || !selectedUserId) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Veuillez sélectionner un utilisateur.',
            });
            return;
        }

        // Vérifier si l'utilisateur est déjà membre d'une autre équipe
        const isAlreadyMember = teams.some(team => 
            team.members.some(member => member.userId === selectedUserId)
        );

        if (isAlreadyMember) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Cet utilisateur est déjà membre d\'une autre équipe.',
            });
            return;
        }

        try {
            await addMemberToTeam(selectedTeam.id, selectedUserId, memberRole.trim() || undefined);
            setIsAddMemberDialogOpen(false);
            setSelectedUserId('');
            setMemberRole('');
            setSelectedTeam(null);
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        }
    };

    const handleOpenAddMemberDialog = (team: Team) => {
        setSelectedTeam(team);
        setSelectedUserId('');
        setMemberRole('');
        setIsAddMemberDialogOpen(true);
    };

    const handleViewMembers = (team: Team) => {
        setSelectedTeam(team);
        setIsViewMembersDialogOpen(true);
    };

    const handleDeleteTeam = async () => {
        if (!teamToDelete) return;

        try {
            await deleteTeam(teamToDelete.id);
            setTeamToDelete(null);
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        }
    };

    // Obtenir les utilisateurs inscrits et valides pour ajouter aux équipes
    // Exclure ceux qui sont déjà membres d'une autre équipe
    const availableUsers = inscriptions
        .filter(ins => ins.statut === 'VALIDE' && ins.user?.id)
        .map(ins => ({
            id: ins.user!.id,
            email: ins.user!.email,
            nom: ins.user!.nom,
            prenom: ins.user!.prenom,
            fullName: `${ins.user!.prenom} ${ins.user!.nom}`,
        }))
        .filter(user => {
            if (!user.id || !user.email) return false;
            // Vérifier si l'utilisateur est déjà membre d'une autre équipe
            const isMemberOfAnyTeam = teams.some(team => 
                team.members.some(member => member.userId === user.id)
            );
            return !isMemberOfAnyTeam;
        });

    if (loading) {
        return (
            <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des équipes...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Gestion des Équipes</h1>
                        <p className="text-muted-foreground">
                            Créez et gérez les équipes du hackathon {hackathon?.nom || ''}.
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une équipe
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer une nouvelle équipe</DialogTitle>
                                <DialogDescription>
                                    Créez une équipe et ajoutez des membres plus tard.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="team-name">Nom de l'équipe *</Label>
                                    <Input
                                        id="team-name"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        placeholder="Ex: Équipe Alpha"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="team-description">Description</Label>
                                    <Textarea
                                        id="team-description"
                                        value={newTeamDescription}
                                        onChange={(e) => setNewTeamDescription(e.target.value)}
                                        placeholder="Description optionnelle de l'équipe"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="team-projet">Nom du projet</Label>
                                    <Input
                                        id="team-projet"
                                        value={newTeamProjetNom}
                                        onChange={(e) => setNewTeamProjetNom(e.target.value)}
                                        placeholder="Nom du projet associé (optionnel)"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
                                <Button onClick={handleCreateTeam}>Créer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {teams.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">Aucune équipe créée pour le moment.</p>
                            <p className="text-sm text-muted-foreground mt-2">Créez votre première équipe pour commencer.</p>
                        </CardContent>
                    </Card>
                ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <Card key={team.id}>
                            <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle>{team.nom}</CardTitle>
                                            {team.projetNom && (
                                                <Badge variant="secondary" className="mt-2">
                                                    {team.projetNom}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenEditDialog(team)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setTeamToDelete(team)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                </div>
                                    {team.description && (
                                        <CardDescription>{team.description}</CardDescription>
                                    )}
                            </CardHeader>
                            <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                            <span className="text-sm font-semibold">
                                                {team.members.length} membre{team.members.length > 1 ? 's' : ''}
                                            </span>
                                    </div>
                                        {team.members.length === 0 && (
                                            <p className="text-sm text-muted-foreground">Aucun membre dans cette équipe</p>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleOpenAddMemberDialog(team)}
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Ajouter un membre
                                        </Button>
                                        {team.members.length > 0 && (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => handleViewMembers(team)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Voir les membres
                                            </Button>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                )}

                {/* Dialog pour modifier une équipe */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier l'équipe</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de l'équipe.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-team-name">Nom de l'équipe *</Label>
                                <Input
                                    id="edit-team-name"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="Ex: Équipe Alpha"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-team-description">Description</Label>
                                <Textarea
                                    id="edit-team-description"
                                    value={newTeamDescription}
                                    onChange={(e) => setNewTeamDescription(e.target.value)}
                                    placeholder="Description optionnelle de l'équipe"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-team-projet">Nom du projet</Label>
                                <Input
                                    id="edit-team-projet"
                                    value={newTeamProjetNom}
                                    onChange={(e) => setNewTeamProjetNom(e.target.value)}
                                    placeholder="Nom du projet associé (optionnel)"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleEditTeam}>Enregistrer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog pour ajouter un membre */}
                <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
                            <DialogDescription>
                                Sélectionnez un utilisateur inscrit et valide pour l'ajouter à l'équipe. Un utilisateur ne peut être membre que d'une seule équipe.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="select-user">Utilisateur *</Label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger id="select-user">
                                        <SelectValue placeholder="Sélectionner un utilisateur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.length > 0 ? (
                                            availableUsers.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.fullName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                                                Tous les utilisateurs sont déjà membres d'une équipe
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="member-role">Rôle (optionnel)</Label>
                                <Input
                                    id="member-role"
                                    value={memberRole}
                                    onChange={(e) => setMemberRole(e.target.value)}
                                    placeholder="Ex: Chef de projet, Développeur, etc."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleAddMember} disabled={!selectedUserId || availableUsers.length === 0}>
                                Ajouter
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog pour voir les membres d'une équipe */}
                <Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Membres de l'équipe {selectedTeam?.nom}
                            </DialogTitle>
                            <DialogDescription>
                                Liste complète des membres de cette équipe
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-4">
                            {selectedTeam && selectedTeam.members.length > 0 ? (
                                selectedTeam.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>
                                                    {member.user.prenom.substring(0, 1)}{member.user.nom.substring(0, 1)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {member.user.prenom} {member.user.nom}
                                                </p>
                                                {member.role && (
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {member.role}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={async () => {
                                                try {
                                                    await removeMemberFromTeam(selectedTeam.id, member.userId);
                                                    // Mettre à jour la liste des membres dans le dialog
                                                    if (selectedTeam) {
                                                        const updatedTeam = teams.find(t => t.id === selectedTeam.id);
                                                        if (updatedTeam) {
                                                            setSelectedTeam(updatedTeam);
                                                        }
                                                    }
                                                } catch (error) {
                                                    // L'erreur est déjà gérée dans le contexte
                                                }
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Aucun membre dans cette équipe
                                </p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* AlertDialog pour confirmer la suppression */}
                <AlertDialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'équipe ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'équipe "{teamToDelete?.nom}" ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteTeam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
