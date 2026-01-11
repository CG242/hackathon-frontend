'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";
import { useEvent } from "@/context/event-context";
import { hackathonApi } from "@/lib/api";
import { useInscriptions } from "@/context/inscriptions-context";
// Note: la gestion des admins "en localStorage" a été supprimée.

export default function SettingsPage() {
    const { eventSettings, setEventSettings, hackathon, refreshHackathon } = useEvent();
    const { inscriptions } = useInscriptions();
    const { toast } = useToast();
    const [hackForm, setHackForm] = useState({
      nom: "",
      dateDebut: "",
      dateFin: "",
      dateLimiteInscription: "",
      status: "UPCOMING",
    });

    useEffect(() => {
      if (hackathon) {
        setHackForm({
          nom: hackathon.nom || "",
          dateDebut: hackathon.dateDebut ? new Date(hackathon.dateDebut).toISOString().slice(0,16) : "",
          dateFin: hackathon.dateFin ? new Date(hackathon.dateFin).toISOString().slice(0,16) : "",
          dateLimiteInscription: hackathon.dateLimiteInscription ? new Date(hackathon.dateLimiteInscription).toISOString().slice(0,16) : "",
          status: hackathon.status || "UPCOMING",
        });
      }
    }, [hackathon]);

    const handleHackChange = (field: string, value: string) => {
      setHackForm(prev => ({ ...prev, [field]: value }));
    };

    const handleHackSave = async () => {
      if (!hackathon?.id) {
        toast({ variant: "destructive", title: "Erreur", description: "Aucun hackathon actif à mettre à jour." });
        return;
      }
      try {
        await hackathonApi.updateHackathon(hackathon.id, {
          nom: hackForm.nom,
          dateDebut: hackForm.dateDebut ? new Date(hackForm.dateDebut).toISOString() : undefined,
          dateFin: hackForm.dateFin ? new Date(hackForm.dateFin).toISOString() : undefined,
          dateLimiteInscription: hackForm.dateLimiteInscription ? new Date(hackForm.dateLimiteInscription).toISOString() : undefined,
          status: hackForm.status as any,
        });
        await refreshHackathon();
        toast({ title: "Hackathon mis à jour", description: "Les paramètres ont été enregistrés." });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur", description: error?.message || "Impossible de mettre à jour le hackathon." });
      }
    };

    const handleSettingChange = <K extends keyof typeof eventSettings>(key: K, value: (typeof eventSettings)[K]) => {
        setEventSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }));
    };

    // Synchroniser automatiquement le compteur avec les inscriptions réelles
    useEffect(() => {
        // Si currentRegistrations n'est pas défini ou est 0, utiliser le nombre réel d'inscriptions
        if (!eventSettings.currentRegistrations || eventSettings.currentRegistrations === 0) {
            setEventSettings(prevSettings => ({
                ...prevSettings,
                currentRegistrations: inscriptions.length
            }));
        }
    }, [inscriptions.length, eventSettings.currentRegistrations, setEventSettings]);

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
                            <TabsTrigger value="hackathon">Hackathon</TabsTrigger>
                            <TabsTrigger value="prizes">Prix</TabsTrigger>
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
                                        <Label htmlFor="registrationGoal">Objectif d'inscriptions</Label>
                                        <Input id="registrationGoal" type="number" value={eventSettings.registrationGoal} onChange={(e) => handleSettingChange('registrationGoal', parseInt(e.target.value, 10))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currentRegistrations">Nombre actuel d'inscriptions</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="currentRegistrations"
                                                type="number"
                                                value={eventSettings.currentRegistrations || inscriptions.length}
                                                onChange={(e) => handleSettingChange('currentRegistrations', parseInt(e.target.value, 10))}
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                Réel: {inscriptions.length}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Le compteur se met à jour automatiquement. Modifiez-le manuellement pour des corrections.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label>Afficher le compte à rebours</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Compteur intelligent qui s'adapte aux phases de l'événement : début → soumission → fin.
                                            </p>
                                        </div>
                                        <Switch checked={eventSettings.countdownEnabled} onCheckedChange={(checked) => handleSettingChange('countdownEnabled', checked)} />
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

                        <TabsContent value="hackathon">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hackathon actif</CardTitle>
                                    <CardDescription>Modifier les infos et la date limite d'inscription.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input value={hackForm.nom} onChange={(e) => handleHackChange("nom", e.target.value)} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Date de début</Label>
                                      <Input type="datetime-local" value={hackForm.dateDebut} onChange={(e) => handleHackChange("dateDebut", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Date de fin</Label>
                                      <Input type="datetime-local" value={hackForm.dateFin} onChange={(e) => handleHackChange("dateFin", e.target.value)} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Date limite d'inscription</Label>
                                    <Input type="datetime-local" value={hackForm.dateLimiteInscription} onChange={(e) => handleHackChange("dateLimiteInscription", e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Statut</Label>
                                    <Select value={hackForm.status} onValueChange={(v) => handleHackChange("status", v)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choisir un statut" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="UPCOMING">À venir</SelectItem>
                                        <SelectItem value="ONGOING">En cours</SelectItem>
                                        <SelectItem value="PAST">Terminé</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </CardContent>
                                <CardFooter className="justify-end">
                                  <Button onClick={handleHackSave}>Enregistrer</Button>
                                </CardFooter>
                            </Card>
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
