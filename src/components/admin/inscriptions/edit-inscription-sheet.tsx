'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useInscriptions } from "@/context/inscriptions-context";
import { adminApi, type Inscription } from "@/lib/api";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit faire au moins 2 caractères."),
  prenom: z.string().min(2, "Le prénom doit faire au moins 2 caractères."),
  email: z.string().email("Veuillez saisir un e-mail valide."),
  promo: z.string().min(1, "Veuillez sélectionner une promotion."),
  statut: z.enum(["EN_ATTENTE", "VALIDE", "REFUSE"], {
    required_error: "Veuillez sélectionner un statut.",
  }),
});

interface EditInscriptionSheetProps {
  inscription: Inscription | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditInscriptionSheet({ inscription, isOpen, onOpenChange }: EditInscriptionSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { updateInscription, refreshInscriptions } = useInscriptions();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (inscription) {
            // Récupérer la classe complète depuis technologies (tableau) ou promo
            const classeComplete =
              (Array.isArray(inscription.technologies) ? (inscription.technologies as any[])[0] : '') ||
              (inscription.technologies as any)?.classe ||
              inscription.promo ||
              '';
            form.reset({
                nom: inscription.user?.nom || '',
                prenom: inscription.user?.prenom || '',
                email: inscription.user?.email || '',
                promo: classeComplete,
                statut: inscription.statut || 'EN_ATTENTE',
            });
        }
    }, [inscription, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!inscription || !inscription.user) return;

        setIsLoading(true);
        try {
            // Mettre à jour l'utilisateur (nom, prénom, email)
            await adminApi.updateUser(inscription.user.id, {
                nom: values.nom,
                prenom: values.prenom,
                email: values.email,
            });
            
            // Stocker la classe telle quelle dans technologies (tableau), laisser promo vide
            await updateInscription(inscription.id, {
                promo: undefined,
                technologies: [values.promo],
                statut: values.statut,
            });
            
            // Recharger les inscriptions pour avoir les données à jour
            await refreshInscriptions();
            
            toast({
                title: "Modification réussie !",
                description: "Les informations du participant ont été mises à jour.",
            });
            onOpenChange(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: error?.message || 'Impossible de mettre à jour les informations.',
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg flex flex-col">
            <SheetHeader>
                <SheetTitle>Modifier l'inscription</SheetTitle>
                <SheetDescription>
                    Modifiez les informations du participant ci-dessous.
                </SheetDescription>
            </SheetHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6 py-6">
                        {inscription && inscription.user && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="prenom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="promo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Promotion (Classe)</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez une promotion" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="LIC1 A">LIC1 A</SelectItem>
                                                    <SelectItem value="LIC1 B">LIC1 B</SelectItem>
                                                    <SelectItem value="LIC1 C">LIC1 C</SelectItem>
                                                    <SelectItem value="LIC2 A">LIC2 A</SelectItem>
                                                    <SelectItem value="LIC2 B">LIC2 B</SelectItem>
                                                    <SelectItem value="LRT A">LRT A</SelectItem>
                                                    <SelectItem value="LRT B">LRT B</SelectItem>
                                                    <SelectItem value="LRT 2 A">LRT 2 A</SelectItem>
                                                    <SelectItem value="LRT 2 B">LRT 2 B</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="statut"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Statut</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un statut" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                                                    <SelectItem value="VALIDE">Valide</SelectItem>
                                                    <SelectItem value="REFUSE">Refusé</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {inscription && !inscription.user && (
                            <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
                                Impossible de modifier cette inscription : aucune information utilisateur disponible.
                            </div>
                        )}
                    </div>
                     <SheetFooter className="pt-6">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Annuler</Button>
                        </SheetClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </SheetFooter>
                </form>
            </Form>
        </SheetContent>
    </Sheet>
  );
}
