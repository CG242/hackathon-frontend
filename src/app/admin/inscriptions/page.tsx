'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useInscriptions } from "@/context/inscriptions-context";
import { Badge } from "@/components/ui/badge";

export default function InscriptionsPage() {
    const { inscriptions } = useInscriptions();

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Inscriptions</h1>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Participants</CardTitle>
                        <CardDescription>
                            {inscriptions.length} participants inscrits au total.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom Complet</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Classe</TableHead>
                                    <TableHead>Date d'inscription</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inscriptions.length > 0 ? (
                                    inscriptions.map((inscription) => (
                                        <TableRow key={inscription.email}>
                                            <TableCell className="font-medium">{inscription.fullName}</TableCell>
                                            <TableCell>{inscription.email}</TableCell>
                                            <TableCell><Badge variant="outline">{inscription.classe}</Badge></TableCell>
                                            <TableCell>{new Date(inscription.date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
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
