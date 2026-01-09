'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useInscriptions } from "@/context/inscriptions-context";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function InscriptionsPage() {
    const { inscriptions, loading: loadingMyInscriptions } = useInscriptions();
    const [allInscriptions, setAllInscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Le contexte inscriptions-context charge automatiquement toutes les inscriptions pour l'admin
        // et seulement les inscriptions de l'utilisateur pour les utilisateurs normaux
        setAllInscriptions(inscriptions);
        setLoading(false);
    }, [inscriptions]);

    if (loading || loadingMyInscriptions) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Inscriptions</h1>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Participants</CardTitle>
                        <CardDescription>
                            {allInscriptions.length} participants inscrits au total.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Prénom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Promotion</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Date d'inscription</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allInscriptions.length > 0 ? (
                                    allInscriptions.map((inscription) => (
                                        <TableRow key={inscription.id}>
                                            <TableCell className="font-medium">{inscription.user?.nom || '-'}</TableCell>
                                            <TableCell>{inscription.user?.prenom || '-'}</TableCell>
                                            <TableCell>{inscription.user?.email || '-'}</TableCell>
                                            <TableCell>
                                                {inscription.promo ? (
                                                    <Badge variant="outline">{inscription.promo}</Badge>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    inscription.statut === 'VALIDE' ? 'default' :
                                                    inscription.statut === 'REFUSE' ? 'destructive' :
                                                    'secondary'
                                                }>
                                                    {inscription.statut}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(inscription.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Aucune inscription pour le moment.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
