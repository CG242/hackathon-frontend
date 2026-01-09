'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useInscriptions } from "@/context/inscriptions-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Inscription, InscriptionStatus } from "@/context/inscriptions-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditInscriptionSheet from "@/components/admin/inscriptions/edit-inscription-sheet";


export default function InscriptionsPage() {
    const { inscriptions, updateInscription } = useInscriptions();
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);

    const handleStatusChange = (id: string, status: InscriptionStatus) => {
        updateInscription(id, { status });
        const inscription = inscriptions.find(i => i.id === id);
        if (inscription) {
            toast({
                title: "Statut mis à jour",
                description: `L'inscription de ${inscription.email} est maintenant ${status.toLowerCase()}.`
            })
        }
    };

    const handleEdit = (inscription: Inscription) => {
        setSelectedInscription(inscription);
        setIsSheetOpen(true);
    };

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
                        <div className="relative w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom Complet</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Date d'inscription</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inscriptions.length > 0 ? (
                                        inscriptions.map((inscription) => (
                                            <TableRow key={inscription.id}>
                                                <TableCell className="font-medium">{inscription.fullName}</TableCell>
                                                <TableCell>{inscription.email}</TableCell>
                                                <TableCell><Badge variant="outline">{inscription.classe}</Badge></TableCell>
                                                <TableCell>{new Date(inscription.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                      variant={
                                                        inscription.status === 'Accepté' ? 'default' :
                                                        inscription.status === 'Rejeté' ? 'destructive' :
                                                        'secondary'
                                                      }
                                                      className={cn(
                                                        "capitalize",
                                                        inscription.status === 'Accepté' && "bg-green-600/80 text-white"
                                                      )}
                                                    >
                                                      {inscription.status}
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
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                                Aucune inscription pour le moment.
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
        </div>
    );
}
