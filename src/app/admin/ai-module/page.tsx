import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

export default function AiModulePage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Module IA</h1>
                <p className="text-muted-foreground">
                    Configurez et interagissez avec les fonctionnalités d'intelligence artificielle.
                </p>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paramètres d'IA</CardTitle>
                            <CardDescription>Activez ou désactivez les fonctionnalités d'IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="prediction-switch" className="flex flex-col space-y-1">
                                  <span>Prédictions d'inscriptions</span>
                                  <span className="font-normal leading-snug text-muted-foreground">
                                    Utilise l'IA pour prédire la courbe des inscriptions.
                                  </span>
                                </Label>
                                <Switch id="prediction-switch" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="moderation-switch" className="flex flex-col space-y-1">
                                  <span>Modération de contenu</span>
                                  <span className="font-normal leading-snug text-muted-foreground">
                                    Analyse et signale automatiquement le contenu inapproprié.
                                  </span>
                                </Label>
                                <Switch id="moderation-switch" />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="support-switch" className="flex flex-col space-y-1">
                                  <span>Support par Chatbot</span>
                                  <span className="font-normal leading-snug text-muted-foreground">
                                    Active un chatbot pour répondre aux questions fréquentes.
                                  </span>
                                </Label>
                                <Switch id="support-switch" defaultChecked/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 />
                                Générateur de Contenu
                            </CardTitle>
                            <CardDescription>Générez des annonces ou des descriptions de projet avec l'IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea placeholder="Décrivez brièvement le sujet de l'annonce..." rows={5}/>
                            <Button className="w-full">
                                Générer une proposition
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
