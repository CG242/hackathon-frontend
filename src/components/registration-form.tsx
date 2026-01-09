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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authApi, hackathonApi, Hackathon } from "@/lib/api";

const formSchema = z.object({
  nom: z.string().min(1, {
    message: "Le nom est requis.",
  }),
  prenom: z.string().min(1, {
    message: "Le prénom est requis.",
  }),
  email: z.string().email({
    message: "Veuillez saisir une adresse e-mail valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  promo: z.enum(['L1', 'L2']).optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
  technologyInput: z.string().optional(), // Champ temporaire pour ajouter des technologies
});

export default function RegistrationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [hackathonId, setHackathonId] = useState<string | null>(null);
    const [availableHackathons, setAvailableHackathons] = useState<Hackathon[]>([]);
    const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
    const [loadingHackathon, setLoadingHackathon] = useState(true);
    const { toast } = useToast();
    
    // Récupérer tous les hackathons disponibles au chargement
    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                setLoadingHackathon(true);
                const hackathons = await hackathonApi.getAvailableHackathons();
                console.log('✅ Hackathons disponibles récupérés:', hackathons.length);
                
                if (hackathons.length === 0) {
                    toast({
                        variant: 'destructive',
                        title: 'Aucun hackathon disponible',
                        description: 'Il n\'y a actuellement aucun hackathon ouvert aux inscriptions.',
                    });
                    return;
                }

                // Vérifier que tous les IDs sont des UUIDs valides
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                const invalidHackathons = hackathons.filter(h => !uuidRegex.test(h.id));
                
                if (invalidHackathons.length > 0) {
                    console.error('⚠️ Certains hackathons ont des IDs invalides:', invalidHackathons);
                    toast({
                        variant: 'destructive',
                        title: 'Erreur de configuration',
                        description: 'Certains hackathons ont des IDs invalides. Veuillez contacter l\'administrateur.',
                    });
                    // Filtrer les hackathons invalides
                    const validHackathons = hackathons.filter(h => uuidRegex.test(h.id));
                    setAvailableHackathons(validHackathons);
                } else {
                    setAvailableHackathons(hackathons);
                }

                // Sélectionner le premier hackathon par défaut
                if (hackathons.length > 0 && uuidRegex.test(hackathons[0].id)) {
                    setHackathonId(hackathons[0].id);
                    setSelectedHackathon(hackathons[0]);
                }
            } catch (error: any) {
                const errorMessage = error?.message || error?.error || 'Erreur inconnue';
                const errorDetails = error?.data || {};
                const statusCode = error?.statusCode || error?.status;
                
                console.error('Erreur lors de la récupération des hackathons:', {
                    message: errorMessage,
                    details: errorDetails,
                    status: statusCode,
                    fullError: error
                });
                
                toast({
                    variant: 'destructive',
                    title: 'Erreur',
                    description: 'Impossible de récupérer les hackathons disponibles. Veuillez réessayer plus tard.',
                });
            } finally {
                setLoadingHackathon(false);
            }
        };

        fetchHackathons();
    }, [toast]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            promo: undefined,
            technologies: [],
            technologyInput: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!hackathonId) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Veuillez sélectionner un hackathon.',
            });
            return;
        }

        if (!selectedHackathon) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Hackathon sélectionné invalide. Veuillez en choisir un autre.',
            });
            return;
        }

        setIsLoading(true);
        
        try {
            // Préparer les données selon le format attendu par le backend
            // Le backend attend : email, password, nom, prenom, promo (optionnel), technologies (optionnel), hackathonId (UUID)
            
            // Vérifier que hackathonId est un UUID valide (le backend utilise @IsUUID())
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(hackathonId)) {
                console.error('⚠️ L\'ID du hackathon n\'est pas un UUID valide:', hackathonId);
                toast({
                    variant: 'destructive',
                    title: 'Erreur de configuration',
                    description: 'L\'ID du hackathon n\'est pas valide. Veuillez contacter l\'administrateur.',
                });
                return;
            }

            // Préparer les données - ne pas envoyer les champs optionnels s'ils sont vides
            const registerData: any = {
                email: values.email.trim(),
                password: values.password,
                nom: values.nom.trim(),
                prenom: values.prenom.trim(),
                hackathonId: hackathonId,
            };

            // Ajouter promo seulement si elle est définie et non vide
            if (values.promo && values.promo !== '') {
                registerData.promo = values.promo;
            }

            // Ajouter technologies seulement si le tableau n'est pas vide
            if (values.technologies && values.technologies.length > 0) {
                registerData.technologies = values.technologies;
            }

            console.log('Données envoyées au backend:', registerData);

            await authApi.register(registerData);
            
            toast({
                title: "Inscription réussie ! 🎉",
                description: "Nous avons bien reçu votre inscription. Consultez votre e-mail pour plus de détails.",
            });
            form.reset();
        } catch (error: any) {
            // Améliorer la gestion d'erreur pour afficher plus d'informations
            const errorMessage = error?.message || error?.error || error?.data?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            const errorDetails = error?.data || error?.response?.data || {};
            const statusCode = error?.statusCode || error?.status || error?.response?.status;
            
            console.error('Erreur lors de l\'inscription:', {
                message: errorMessage,
                details: errorDetails,
                status: statusCode,
                fullError: error
            });
            
            // Message d'erreur plus spécifique selon le type d'erreur
            let userMessage = errorMessage;
            
            // Si c'est une erreur 400 (validation), essayer d'extraire les détails de validation
            if (statusCode === 400) {
                // Le backend peut retourner des erreurs de validation détaillées
                if (errorDetails?.issues && Array.isArray(errorDetails.issues)) {
                    // Erreurs Zod
                    const validationErrors = errorDetails.issues.map((issue: any) => {
                        const field = issue.path?.join('.') || 'champ';
                        return `${field}: ${issue.message}`;
                    }).join(', ');
                    userMessage = `Erreurs de validation : ${validationErrors}`;
                } else if (errorDetails?.message) {
                    userMessage = errorDetails.message;
                } else if (Array.isArray(errorDetails)) {
                    // Erreurs class-validator
                    const validationErrors = errorDetails.map((err: any) => {
                        const field = Object.keys(err.constraints || {})[0] || 'champ';
                        return `${field}: ${err.constraints[field]}`;
                    }).join(', ');
                    userMessage = `Erreurs de validation : ${validationErrors}`;
                } else {
                    userMessage = 'Les données fournies sont invalides. Vérifiez vos informations.';
                }
            } else if (statusCode === 409) {
                userMessage = 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.';
            } else if (statusCode === 404) {
                userMessage = 'Aucun hackathon actif trouvé. Veuillez réessayer plus tard.';
            } else if (statusCode === 500) {
                userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            } else if (!statusCode && errorMessage.includes('fetch')) {
                userMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
            }
            
            toast({
                variant: 'destructive',
                title: 'Erreur d\'inscription',
                description: userMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Card className="border-primary/50 border-2 shadow-xl shadow-primary/10">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">S'inscrire au Hackathon</CardTitle>
            <CardDescription>
                Choisissez le hackathon auquel vous souhaitez participer et remplissez le formulaire ci-dessous.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    {/* Sélection du hackathon */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hackathon *</label>
                        {loadingHackathon ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Chargement des hackathons disponibles...
                            </div>
                        ) : availableHackathons.length === 0 ? (
                            <p className="text-sm text-destructive">Aucun hackathon disponible pour le moment.</p>
                        ) : (
                            <Select
                                value={hackathonId || ''}
                                onValueChange={(value) => {
                                    const selected = availableHackathons.find(h => h.id === value);
                                    if (selected) {
                                        setHackathonId(value);
                                        setSelectedHackathon(selected);
                                    }
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un hackathon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableHackathons.map((hackathon) => (
                                        <SelectItem key={hackathon.id} value={hackathon.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{hackathon.nom}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(hackathon.dateDebut).toLocaleDateString('fr-FR')} - {new Date(hackathon.dateFin).toLocaleDateString('fr-FR')}
                                                    {hackathon.status === 'ONGOING' && (
                                                        <Badge variant="default" className="ml-2">En cours</Badge>
                                                    )}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {selectedHackathon && (
                            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
                                <p><strong>Description :</strong> {selectedHackathon.description}</p>
                                <p><strong>Date limite d'inscription :</strong> {new Date(selectedHackathon.dateLimiteInscription).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dupont" {...field} />
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
                                        <Input placeholder="Jean" {...field} />
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
                                    <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Minimum 6 caractères" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Si vous avez déjà un compte, utilisez le même mot de passe.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="promo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Promotion (optionnel)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez votre promotion" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="L1">L1</SelectItem>
                                        <SelectItem value="L2">L2</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Promotion de licence (optionnel)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Technologies (optionnel)</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Ajouter une technologie (ex: React, Node.js, Python...)"
                                                value={form.watch('technologyInput') || ''}
                                                onChange={(e) => {
                                                    form.setValue('technologyInput', e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const tech = form.getValues('technologyInput')?.trim();
                                                        if (tech && !field.value?.includes(tech)) {
                                                            field.onChange([...(field.value || []), tech]);
                                                            form.setValue('technologyInput', '');
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const tech = form.getValues('technologyInput')?.trim();
                                                    if (tech && !field.value?.includes(tech)) {
                                                        field.onChange([...(field.value || []), tech]);
                                                        form.setValue('technologyInput', '');
                                                    }
                                                }}
                                            >
                                                Ajouter
                                            </Button>
                                        </div>
                                        {field.value && field.value.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {field.value.map((tech, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                field.onChange(field.value?.filter((_, i) => i !== index));
                                                            }}
                                                            className="ml-1 hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Ajoutez les technologies que vous maîtrisez (optionnel)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || loadingHackathon}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Envoi en cours..." : loadingHackathon ? "Chargement..." : "Soumettre l'inscription"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
