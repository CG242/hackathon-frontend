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
import { authApi } from "@/lib/api";
import { useEvent } from "@/context/event-context";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit comporter au moins 2 caractères.",
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
    const { hackathon } = useEvent();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            classe: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!hackathon?.id) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Aucun hackathon actif pour l'inscription.",
          });
          return;
        }
        setIsLoading(true);
        try {
          await authApi.register({
            email: values.email,
            password: `${values.email}-motdepasse`,
            nom: values.nom,
            prenom: values.prenom,
            // Promo laissée vide, mais on stocke la classe choisie dans technologies (tableau de strings)
            promo: undefined,
            technologies: [values.classe],
            hackathonId: hackathon.id,
          });

          toast({
            title: "Inscription réussie ! 🎉",
            description: "Nous avons bien reçu votre inscription. Un e-mail de confirmation vous a été envoyé.",
          });
          form.reset({ nom: "", prenom: "", email: "", classe: undefined });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error?.message || "Impossible de finaliser l'inscription.",
          });
        } finally {
          setIsLoading(false);
        }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="prenom"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                  <Input placeholder="Prénom" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="nom"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                  <Input placeholder="Nom" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="prenom.nom@example.com" {...field} />
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
