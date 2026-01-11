'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useInscriptions } from "@/context/inscriptions-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InscriptionStatus } from "@/context/inscriptions-context";
import { Inscription } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditInscriptionSheet from "@/components/admin/inscriptions/edit-inscription-sheet";
import { useEvent } from "@/context/event-context";
import { resultatsApi } from "@/lib/api";
import { Download } from "lucide-react";
import { getApiBaseUrl, getAuthHeaders } from "@/lib/api-config";


export default function InscriptionsPage() {
    const { inscriptions, updateInscription, loading } = useInscriptions();
    const { toast } = useToast();
    const { hackathon } = useEvent();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [inscriptionToDelete, setInscriptionToDelete] = useState<Inscription | null>(null);

    const getFullName = (inscription: Inscription) => {
        if (inscription.user?.prenom || inscription.user?.nom) {
            return `${inscription.user?.nom ?? ''} ${inscription.user?.prenom ?? ''}`.trim();
        }
        return inscription.user?.email || inscription.email || 'Participant';
    };

    const getPrenom = (inscription: Inscription) => inscription.user?.prenom || '-';
    const getNom = (inscription: Inscription) => inscription.user?.nom || '-';

    const handleDownloadInscriptionsPdf = async () => {
        if (!hackathon?.id) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Aucun hackathon actif.",
            });
            return;
        }

        setGeneratingPdf(true);
        try {
            const blob = await resultatsApi.generateInscriptionsListPdf(hackathon.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `liste-inscrits-${hackathon.nom}-${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "PDF téléchargé",
                description: "La liste des inscrits a été téléchargée.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error?.message || "Impossible de générer le PDF.",
            });
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleStatusChange = async (id: string, status: InscriptionStatus) => {
        try {
            // Convertir le statut de l'ancien format au nouveau format backend
            const backendStatus = status === 'Accepté' ? 'VALIDE' : status === 'Rejeté' ? 'REFUSE' : 'EN_ATTENTE';
            await updateInscription(id, { statut: backendStatus });
        const inscription = inscriptions.find(i => i.id === id);
        if (inscription) {
            toast({
                title: "Statut mis à jour",
                    description: `L'inscription de ${getFullName(inscription)} est maintenant ${status.toLowerCase()}.`
                });
            }
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        }
    };

    const handleEdit = (inscription: Inscription) => {
        setSelectedInscription(inscription);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (inscription: Inscription) => {
        setInscriptionToDelete(inscription);
        setIsDeleteDialogOpen(true);
    };


    const handleDeleteConfirm = async () => {
        if (!inscriptionToDelete || !hackathon?.id) return;

        const url = `${getApiBaseUrl()}/inscriptions/admin/user/${inscriptionToDelete.userId}/hackathon/${hackathon.id}`;
        const headers = getAuthHeaders();

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Créer un message détaillé basé sur la réponse du backend
            let description = `${getFullName(inscriptionToDelete)} a été retiré du hackathon.`;

            // Note: Le backend retourne maintenant des détails complets
            // On garde le message simple pour l'instant, mais on pourrait l'enrichir

            toast({
                title: "Utilisateur supprimé avec succès",
                description: description,
            });

            // Recharger les inscriptions
            window.location.reload();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error?.message || "Impossible de supprimer l'utilisateur.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setInscriptionToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline">Inscriptions</h1>
                    <Button
                        variant="outline"
                        onClick={handleDownloadInscriptionsPdf}
                        disabled={generatingPdf || loading}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {generatingPdf ? "Génération..." : "Télécharger la liste (PDF)"}
                    </Button>
                </div>

                
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Participants</CardTitle>
                        <CardDescription>
                            {inscriptions.length} participants inscrits au total.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Prénom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Date d'inscription</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inscriptions.length > 0 ? (
                                        inscriptions.map((inscription) => {
                                            const status = inscription.statut === 'VALIDE' ? 'Accepté' : 
                                                          inscription.statut === 'REFUSE' ? 'Rejeté' : 'En attente';
                                            return (
                                            <TableRow key={inscription.id}>
                                                <TableCell className="font-medium">
                                                    {getNom(inscription)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {getPrenom(inscription)}
                                                </TableCell>
                                                <TableCell>{inscription.user?.email || inscription.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {(inscription.technologies as any)?.classe 
                                                          || (Array.isArray(inscription.technologies) ? (inscription.technologies as any[])[0] : undefined)
                                                          || inscription.promo 
                                                          || '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(inscription.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                      variant={
                                                        status === 'Accepté' ? 'default' :
                                                        status === 'Rejeté' ? 'destructive' :
                                                        'secondary'
                                                      }
                                                      className={cn(
                                                        "capitalize",
                                                        status === 'Accepté' && "bg-green-600/80 text-white"
                                                      )}
                                                    >
                                                      {status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                     <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleStatusChange(inscription.id, 'Accepté')}>
                                                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                                Accepter
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(inscription.id, 'Rejeté')}>
                                                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                                                Rejeter
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEdit(inscription)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(inscription)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                                                {searchQuery ? "Aucun résultat pour cette recherche." : "Aucune inscription pour le moment."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <EditInscriptionSheet
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                inscription={selectedInscription}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'inscription de{' '}
                            <strong>{inscriptionToDelete ? getFullName(inscriptionToDelete) : ''}</strong>{' '}
                            ({inscriptionToDelete?.user?.email || inscriptionToDelete?.email}) ?
                            <br />
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
