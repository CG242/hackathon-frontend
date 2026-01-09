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
import { UserPlus, Users, Trash2, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEvent } from "@/context/event-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
                    <Input id="new-admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cfi-ciras@example.com" required/>
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
    const { users, removeUser, user: currentUser } = useAuth();
    const { toast } = useToast();

    const handleDelete = (email: string) => {
        removeUser(email);
        toast({
            title: "Utilisateur supprimé",
            description: `${email} a été supprimé de la liste des administrateurs.`,
        });
    }

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

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={user.email === currentUser?.email}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Supprimer</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement
                                l'administrateur <span className="font-bold">{user.email}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(user.email)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
    const { eventSettings, setEventSettings } = useEvent();
    const { toast } = useToast();

    const handleSettingChange = <K extends keyof typeof eventSettings>(key: K, value: (typeof eventSettings)[K]) => {
        setEventSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }));
    };

    const handlePrizeChange = (prize: keyof typeof eventSettings.prizes, value: string) => {
        setEventSettings(prevSettings => ({
            ...prevSettings,
            prizes: {
                ...prevSettings.prizes,
                [prize]: value
            }
        }));
    };
    
    const handleSaveChanges = () => {
        // This function is now just for user feedback, as changes are saved live.
        toast({
            title: "Modifications enregistrées !",
            description: "Les paramètres sont sauvegardés au fur et à mesure.",
        });
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <main className="p-4 md:p-8 flex-1">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Configuration</h1>
                        <p className="text-muted-foreground">
                            Gérez les paramètres généraux de l'application et de l'événement.
                        </p>
                    </div>
                    
                    <Tabs defaultValue="event">
                        <TabsList className="grid w-full max-w-lg grid-cols-2 sm:grid-cols-5">
                            <TabsTrigger value="general">Général</TabsTrigger>
                            <TabsTrigger value="event">Événement</TabsTrigger>
                            <TabsTrigger value="prizes">Prix</TabsTrigger>
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
                                        <Input id="appName" defaultValue="Hackathon CFI-CIRAS" />
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
                                        <Input id="eventName" value={eventSettings.eventName} onChange={(e) => handleSettingChange('eventName', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="eventDate">Date de début</Label>
                                        <Input id="eventDate" type="datetime-local" value={eventSettings.eventDate} onChange={(e) => handleSettingChange('eventDate', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="registrationGoal">Objectif d'inscriptions</Label>
                                        <Input id="registrationGoal" type="number" value={eventSettings.registrationGoal} onChange={(e) => handleSettingChange('registrationGoal', parseInt(e.target.value, 10))} />
                                    </div>
                                     <div className="flex items-center justify-between rounded-lg border p-4">
                                         <div className="space-y-0.5">
                                            <Label>Inscriptions Ouvertes</Label>
                                            <p className="text-sm text-muted-foreground">
                                              Permettre aux participants de s'inscrire via le formulaire.
                                            </p>
                                        </div>
                                        <Switch checked={eventSettings.registrationsOpen} onCheckedChange={(checked) => handleSettingChange('registrationsOpen', checked)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="prizes">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Prix du Hackathon</CardTitle>
                                    <CardDescription>Modifiez les montants des récompenses pour les gagnants.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstPrize" className="flex items-center gap-2"><Trophy className="text-yellow-400"/> 1ère Place</Label>
                                        <Input id="firstPrize" value={eventSettings.prizes.first} onChange={(e) => handlePrizeChange('first', e.target.value)} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="secondPrize" className="flex items-center gap-2"><Trophy className="text-slate-300"/> 2ème Place</Label>
                                        <Input id="secondPrize" value={eventSettings.prizes.second} onChange={(e) => handlePrizeChange('second', e.target.value)} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="thirdPrize" className="flex items-center gap-2"><Trophy className="text-yellow-600"/> 3ème Place</Label>
                                        <Input id="thirdPrize" value={eventSettings.prizes.third} onChange={(e) => handlePrizeChange('third', e.target.value)} />
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
                    <div className="flex justify-end pt-8">
                        <Button onClick={handleSaveChanges}>Enregistrer les modifications</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
