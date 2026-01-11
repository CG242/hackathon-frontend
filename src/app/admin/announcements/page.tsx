'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Megaphone, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAnnouncements } from "@/context/announcements-context";
import { Annonce } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AnnouncementsPage() {
    const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement, loading } = useAnnouncements();
    const { toast } = useToast();
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newScope, setNewScope] = useState<"public" | "private">("public");
    const [isCreating, setIsCreating] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Annonce | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editScope, setEditScope] = useState<"public" | "private">("public");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Annonce | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAddAnnouncement = async () => {
        if (!newTitle || !newContent) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Veuillez remplir tous les champs.',
            });
            return;
        }

        try {
            setIsCreating(true);
            await createAnnouncement({
                titre: newTitle,
                contenu: newContent,
                cible: newScope === 'public' ? 'PUBLIC' : 'INSCRITS',
            });
            setNewTitle("");
            setNewContent("");
            setNewScope("public");
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = (announcement: Annonce) => {
        setEditingAnnouncement(announcement);
        setEditTitle(announcement.titre);
        setEditContent(announcement.contenu);
        setEditScope(announcement.cible === 'PUBLIC' ? 'public' : 'private');
    };

    const handleUpdateAnnouncement = async () => {
        if (!editingAnnouncement) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Aucune annonce sélectionnée.',
            });
            return;
        }

        const trimmedTitle = editTitle.trim();
        const trimmedContent = editContent.trim();

        if (!trimmedTitle || !trimmedContent) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Le titre et le contenu sont requis et ne peuvent pas être vides.',
            });
            return;
        }

        try {
            setIsEditing(true);
            await updateAnnouncement(editingAnnouncement.id, {
                titre: trimmedTitle,
                contenu: trimmedContent,
                cible: editScope === 'public' ? 'PUBLIC' : 'INSCRITS',
            });
            setEditingAnnouncement(null);
            setEditTitle("");
            setEditContent("");
            setEditScope("public");
        } catch (error: any) {
            // Extraire le message d'erreur détaillé
            let errorMessage = 'Impossible de mettre à jour l\'annonce.';
            if (error?.data?.errors && Array.isArray(error.data.errors)) {
              // Si c'est un tableau d'erreurs Zod, afficher tous les messages
              // Le backend renvoie path comme une chaîne, pas un tableau (voir zod-validation.pipe.ts ligne 21)
              const messages = error.data.errors.map((err: any) => {
                const path = typeof err.path === 'string' ? err.path : (Array.isArray(err.path) ? err.path.join('.') : '');
                return path ? `${path}: ${err.message}` : err.message;
              }).join('; ');
              errorMessage = messages || error?.data?.message || error?.message || errorMessage;
            } else {
              errorMessage = error?.data?.message || error?.message || errorMessage;
            }
            toast({
                variant: 'destructive',
                title: 'Erreur de validation',
                description: errorMessage,
            });
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (announcement: Annonce) => {
        setAnnouncementToDelete(announcement);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!announcementToDelete) return;

        try {
            setIsDeleting(true);
            await deleteAnnouncement(announcementToDelete.id);
            setDeleteDialogOpen(false);
            setAnnouncementToDelete(null);
        } catch (error) {
            // L'erreur est déjà gérée dans le contexte
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                 <h1 className="text-3xl font-bold font-headline">Annonces</h1>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlusCircle />
                                Créer une nouvelle annonce
                            </CardTitle>
                            <CardDescription>Elle sera visible par tous les participants.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input 
                                placeholder="Titre de l'annonce" 
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <Textarea 
                                placeholder="Contenu de l'annonce..." 
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={5}
                            />
                             <div className="space-y-2">
                                <Label>Visibilité</Label>
                                <RadioGroup defaultValue="public" value={newScope} onValueChange={(value: "public" | "private") => setNewScope(value)} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="public" id="r1" />
                                        <Label htmlFor="r1">Publique</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="private" id="r2" />
                                        <Label htmlFor="r2">Privée (Admin)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <Button onClick={handleAddAnnouncement} className="w-full" disabled={isCreating || loading}>
                                {isCreating ? "Publication..." : "Publier l'annonce"}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold font-headline">Annonces récentes</h2>
                        {loading ? (
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-center text-muted-foreground">Chargement des annonces...</p>
                                </CardContent>
                            </Card>
                        ) : announcements.length === 0 ? (
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-center text-muted-foreground">Aucune annonce pour le moment.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(announcement => (
                                <Card key={announcement.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{announcement.titre}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={announcement.cible === 'PUBLIC' ? 'default' : 'secondary'}>
                                                    {announcement.cible === 'PUBLIC' ? 'Publique' : 'Privée'}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(announcement)}
                                                    className="h-8 w-8"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(announcement)}
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardDescription>{new Date(announcement.createdAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{announcement.contenu}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog de modification */}
            <Dialog open={editingAnnouncement !== null} onOpenChange={(open) => !open && setEditingAnnouncement(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier l'annonce</DialogTitle>
                        <DialogDescription>
                            Modifiez les détails de l'annonce ci-dessous.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Titre</Label>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Titre de l'annonce"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contenu</Label>
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Contenu de l'annonce..."
                                rows={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Visibilité</Label>
                            <RadioGroup value={editScope} onValueChange={(value: "public" | "private") => setEditScope(value)} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="public" id="edit-r1" />
                                    <Label htmlFor="edit-r1">Publique</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="private" id="edit-r2" />
                                    <Label htmlFor="edit-r2">Privée (Admin)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAnnouncement(null)}>
                            Annuler
                        </Button>
                        <Button onClick={handleUpdateAnnouncement} disabled={isEditing}>
                            {isEditing ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de suppression */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'annonce</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
