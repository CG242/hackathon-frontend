'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hackathonApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PastHackathonsPage() {
    const [pastHackathons, setPastHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPastHackathons = async () => {
            try {
                setLoading(true);
                const data = await hackathonApi.getPastHackathons(1, 10);
                // La réponse peut être { data: [], total, page, limit } ou directement un tableau
                const hackathons = data.data || data;
                setPastHackathons(Array.isArray(hackathons) ? hackathons : []);
            } catch (error) {
                console.error('Erreur lors du chargement des hackathons passés:', error);
                setPastHackathons([]);
            } finally {
                setLoading(false);
            }
        };

        loadPastHackathons();
    }, []);
    return (
        <div className="flex flex-col h-full bg-background">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Hackathons Passés</h1>
                    <p className="text-muted-foreground">
                        Archive et résultats des éditions précédentes du hackathon.
                    </p>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : pastHackathons.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {pastHackathons.map((hackathon) => {
                            const year = new Date(hackathon.dateDebut || hackathon.dateFin).getFullYear();
                            return (
                                <Card key={hackathon.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="font-headline text-2xl">{hackathon.nom}</CardTitle>
                                            <Badge variant="outline">{year}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Description</p>
                                            <p className="font-semibold text-sm">{hackathon.description || 'Pas de description'}</p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <p className="text-muted-foreground">{hackathon.nombreInscriptions || 0} Inscriptions</p>
                                            <p className="text-muted-foreground">Status: {hackathon.status}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Du {new Date(hackathon.dateDebut).toLocaleDateString()} au {new Date(hackathon.dateFin).toLocaleDateString()}</p>
                                        </div>
                                        <Button variant="secondary" className="w-full">Voir les détails</Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Aucun hackathon passé pour le moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
