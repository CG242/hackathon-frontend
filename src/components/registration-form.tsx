"use client";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useInscriptions } from "@/context/inscriptions-context";
import type { Inscription } from "@/context/inscriptions-context";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom complet doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez saisir une adresse e-mail valide.",
  }),
  classe: z.string({
    required_error: "Veuillez sélectionner une classe.",
  }),
});


export default function RegistrationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { addInscription } = useInscriptions();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "CFI-CIRAS",
            email: "cfi-ciras@example.com",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            addInscription(values);
            
            setIsLoading(false);
            toast({
                title: "Inscription réussie ! 🎉",
                description: "Nous avons bien reçu votre inscription. Consultez votre e-mail pour plus de détails.",
            });
            form.reset({fullName: "CFI-CIRAS", email: "cfi-ciras@example.com", classe: undefined});
        }, 1000);
    }

  return (
    <Card className="border-primary/50 border-2 shadow-xl shadow-primary/10">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">S'inscrire au Hackathon 2026</CardTitle>
            <CardDescription>Remplissez le formulaire ci-dessous pour participer à l'événement.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                                <Input placeholder="CFI-CIRAS" {...field} />
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
                                <Input type="email" placeholder="cfi-ciras@example.com" {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez votre classe" />
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
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Envoi en cours..." : "Soumettre l'inscription"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
