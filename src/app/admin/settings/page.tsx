'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type AdminUser } from "@/context/auth-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEvent } from "@/context/event-context";

function AddUserForm() {
    const { addUser } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!email || !password) {
            toast({
                variant: "destructive",
                title: "Champs requis",
                description: "Veuillez remplir l'email et le mot de passe.",
            });
            return;
        }
        const newUser: AdminUser = { email, password, role: 'admin' };
        addUser(newUser);
        toast({
            title: "Utilisateur ajouté",
            description: `${email} a été ajouté en tant qu'administrateur.`,
        });
        setEmail('');
        setPassword('');
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus />
                    Ajouter un nouvel administrateur
                </CardTitle>
                <CardDescription>Il aura les mêmes droits que vous.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="new-admin-email">Email</Label>
                    <Input id="new-admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nouvel.admin@cficiras.com" required/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-admin-password">Mot de passe</Label>
                    <Input id="new-admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Ajouter l'utilisateur</Button>
            </CardFooter>
        </form>
    );
}

function UsersList() {
    const { users } = useAuth();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users />
                    Liste des administrateurs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {users.map(user => (
                    <div key={user.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" disabled={user.email === 'admin@cficiras.com'}>
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Supprimer</span>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
    const { eventSettings, setEventSettings } = useEvent();
    const { toast } = useToast();
    
    // Local state to manage form inputs
    const [eventName, setEventName] = useState(eventSettings.eventName);
    const [eventDate, setEventDate] = useState(eventSettings.eventDate);
    const [registrationsOpen, setRegistrationsOpen] = useState(eventSettings.registrationsOpen);

    const handleSaveChanges = () => {
        setEventSettings({
            eventName,
            eventDate,
            registrationsOpen
        });
        toast({
            title: "Paramètres enregistrés !",
            description: "Les modifications ont été sauvegardées.",
        });
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Configuration</h1>
                    <p className="text-muted-foreground">
                        Gérez les paramètres généraux de l'application et de l'événement.
                    </p>
                </div>
                
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full max-w-md grid-cols-4">
                        <TabsTrigger value="general">Général</TabsTrigger>
                        <TabsTrigger value="event">Événement</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                        <TabsTrigger value="appearance">Apparence</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Paramètres Généraux</CardTitle>
                                <CardDescription>Configuration de base de l'application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="appName">Nom de l'application</Label>
                                    <Input id="appName" defaultValue="Hackathon 2026 | CFI-CIRAS" />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                     <div className="space-y-0.5">
                                        <Label>Mode Maintenance</Label>
                                        <p className="text-sm text-muted-foreground">
                                          Rendre le site temporairement inaccessible au public.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="event">
                        <Card>
                            <CardHeader>
                                <CardTitle>Paramètres de l'Événement</CardTitle>
                                <CardDescription>Gérez les dates et les informations du hackathon.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               <div className="space-y-2">
                                    <Label htmlFor="eventName">Nom de l'événement</Label>
                                    <Input id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eventDate">Date de début</Label>
                                    <Input id="eventDate" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                                </div>
                                 <div className="flex items-center justify-between rounded-lg border p-4">
                                     <div className="space-y-0.5">
                                        <Label>Inscriptions Ouvertes</Label>
                                        <p className="text-sm text-muted-foreground">
                                          Permettre aux participants de s'inscrire via le formulaire.
                                        </p>
                                    </div>
                                    <Switch checked={registrationsOpen} onCheckedChange={setRegistrationsOpen} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card>
                                <AddUserForm />
                            </Card>
                            <UsersList />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance">
                         <Card>
                            <CardHeader>
                                <CardTitle>Apparence</CardTitle>
                                <CardDescription>Personnalisez le thème de couleur de l'application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               <div className="space-y-2">
                                    <Label>Couleur Primaire</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" defaultValue="#FFA500" className="w-12 h-10 p-1"/>
                                        <Input defaultValue="hsl(26, 100%, 63%)" disabled/>
                                    </div>
                               </div>
                                <div className="space-y-2">
                                    <Label>Couleur d'Accent</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" defaultValue="#00FFFF" className="w-12 h-10 p-1"/>
                                        <Input defaultValue="hsl(195, 100%, 50%)" disabled/>
                                    </div>
                               </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <div className="flex justify-end">
                    <Button onClick={handleSaveChanges}>Enregistrer les modifications</Button>
                </div>
            </div>
        </div>
    );
}
