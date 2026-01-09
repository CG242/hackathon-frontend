'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Megaphone, PlusCircle, Loader2 } from "lucide-react";
import { useAnnouncements } from "@/context/announcements-context";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AnnouncementsPage() {
    const { announcements, publicAnnouncements, loading, refreshAnnouncements, createAnnouncement } = useAnnouncements();
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newCible, setNewCible] = useState<'PUBLIC' | 'INSCRITS'>('PUBLIC');
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

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
                cible: newCible,
            });
            toast({
                title: 'Annonce créée',
                description: 'L\'annonce a été publiée avec succès.',
            });
            setNewTitle("");
            setNewContent("");
            setNewCible('PUBLIC');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: error?.message || 'Une erreur est survenue lors de la création de l\'annonce.',
            });
        } finally {
            setIsCreating(false);
        }
    }

    // Combiner toutes les annonces pour l'affichage
    const allAnnouncements = [...(publicAnnouncements || []), ...(announcements || [])];
    // Éliminer les doublons par ID
    const uniqueAnnouncements = Array.from(
        new Map(allAnnouncements.map(item => [item.id, item])).values()
    );

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
                                disabled={isCreating}
                            />
                            <Textarea 
                                placeholder="Contenu de l'annonce..." 
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={5}
                                disabled={isCreating}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cible</label>
                                <Select value={newCible} onValueChange={(value: 'PUBLIC' | 'INSCRITS') => setNewCible(value)} disabled={isCreating}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">Public (tous)</SelectItem>
                                        <SelectItem value="INSCRITS">Inscrits uniquement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleAddAnnouncement} className="w-full" disabled={isCreating}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isCreating ? 'Publication en cours...' : 'Publier l\'annonce'}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold font-headline">Annonces récentes</h2>
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : uniqueAnnouncements.length > 0 ? (
                            [...uniqueAnnouncements]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(announcement => (
                                    <Card key={announcement.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{announcement.titre}</CardTitle>
                                                    <CardDescription>
                                                        {new Date(announcement.createdAt).toLocaleDateString()} - 
                                                        {' '}{announcement.cible === 'PUBLIC' ? 'Public' : 'Inscrits'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap">{announcement.contenu}</p>
                                        </CardContent>
                                    </Card>
                                ))
                        ) : (
                            <p className="text-muted-foreground text-center p-8">Aucune annonce pour le moment.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
