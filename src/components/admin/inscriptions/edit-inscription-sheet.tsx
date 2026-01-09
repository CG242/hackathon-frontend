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
import { type Inscription } from "@/context/inscriptions-context";

const formSchema = z.object({
  fullName: z.string().min(2, "Le nom doit faire au moins 2 caractères."),
  email: z.string().email("Veuillez saisir un e-mail valide."),
  classe: z.string().min(1, "Veuillez sélectionner une classe."),
});

interface EditInscriptionSheetProps {
  inscription: Inscription | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditInscriptionSheet({ inscription, isOpen, onOpenChange }: EditInscriptionSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { updateInscription } = useInscriptions();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (inscription) {
            form.reset({
                fullName: inscription.fullName,
                email: inscription.email,
                classe: inscription.classe,
            });
        }
    }, [inscription, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!inscription) return;

        setIsLoading(true);
        setTimeout(() => {
            updateInscription(inscription.id, {
                ...values,
            });
            
            setIsLoading(false);
            toast({
                title: "Modification réussie !",
                description: "Les informations du participant ont été mises à jour.",
            });
            onOpenChange(false);
        }, 1000);
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
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom complet</FormLabel>
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
                            name="classe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Classe</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une classe" />
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
