"use client";

import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BackgroundParticles from "@/components/background-particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Eye, Trophy } from "lucide-react";
import type { Registration, ResultEntry } from "@/lib/types";
import { publishResults } from "@/lib/api-client";

// Données MOCK: à remplacer plus tard par un vrai backend ou une API
const mockRegistrations: Registration[] = [
  {
    id: 1,
    fullName: "Alice Dupont",
    email: "alice.dupont@example.com",
    classe: "LIC1 A",
    createdAt: "2025-12-20 14:32",
  },
  {
    id: 2,
    fullName: "CFI-CIRAS Team",
    email: "team@cfi-ciras.org",
    classe: "LRT 2 B",
    createdAt: "2025-12-21 09:15",
  },
  {
    id: 3,
    fullName: "John Doe",
    email: "john.doe@example.com",
    classe: "LIC2 B",
    createdAt: "2025-12-22 18:47",
  },
];

const mockResults: ResultEntry[] = [
  {
    id: 1,
    teamName: "Team Quantum",
    projectName: "CFI Hack Portal",
    position: 1,
  },
  {
    id: 2,
    teamName: "Data Wizards",
    projectName: "Smart Campus Analytics",
    position: 2,
  },
  {
    id: 3,
    teamName: "Cyber Guardians",
    projectName: "Secure ID Platform",
    position: 3,
  },
];

export default function AdminPage() {
  const [published, setPublished] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>(mockResults);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const DEFAULT_EMAIL = "admin@cfi-ciras.org";
  const DEFAULT_PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginEmail === DEFAULT_EMAIL && loginPassword === DEFAULT_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur l'interface d'administration du hackathon.",
      });
    } else {
      setLoginError("Identifiants invalides. Utilise les identifiants d'accès fournis.");
    }
  };

  const handlePublish = async () => {
    setPublished(true);
    // Pour l'instant, on publie les résultats via la couche de services mockée.
    // Plus tard, cette fonction pourra appeler une vraie API sans changer cette page.
    try {
      await publishResults(results);
    } catch (e) {
      // En cas d'erreur, on laisse un toast simple pour la démo.
    }
    toast({
      title: "Résultats publiés",
      description:
        "Les résultats du hackathon sont maintenant marqués comme publiés. Pense à les communiquer sur la page publique /results.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 bg-gradient-to-b from-background via-background to-background/80">
          <section className="relative flex items-center justify-center min-h-[calc(100vh-5rem)] overflow-hidden">
            <BackgroundParticles />
            <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
              <Card className="w-full border-primary/50 border-2 shadow-xl shadow-primary/10">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Connexion administrateur
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accès réservé à l'équipe d'organisation du Hackathon 2026.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="admin-email">
                        Email
                      </label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@cfi-ciras.org"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="admin-password">
                        Mot de passe
                      </label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="admin123"
                        required
                      />
                    </div>
                    {loginError && (
                      <p className="text-sm text-destructive">
                        {loginError}
                      </p>
                    )}
                    <Button type="submit" className="w-full">
                      Se connecter
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Identifiants par défaut pour la démo : <br />
                      <code>{DEFAULT_EMAIL}</code> / <code>{DEFAULT_PASSWORD}</code>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-gradient-to-b from-background via-background to-background/80">
        <section className="relative overflow-hidden">
          <BackgroundParticles />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                Interface d'administration
              </h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Gérez les inscriptions au Hackathon 2026 et préparez la publication des
                résultats, tout en restant dans le même univers visuel que le site public.
              </p>
            </div>
            <Badge variant={published ? "default" : "outline"} className="self-start">
              {published ? "Résultats publiés" : "Brouillon"}
            </Badge>
          </div>

          <Tabs defaultValue="registrations" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
              <TabsTrigger value="results">Résultats</TabsTrigger>
            </TabsList>

            <TabsContent value="registrations" className="mt-6">
              <Card className="border-primary/50 border-2 shadow-xl shadow-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="font-headline text-xl">
                      Inscriptions au hackathon
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Liste des participants ayant rempli le formulaire d'inscription.
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {mockRegistrations.length} inscriptions
                  </Badge>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {reg.id}
                          </TableCell>
                          <TableCell className="font-medium">{reg.fullName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {reg.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{reg.classe}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {reg.createdAt}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                <Card className="border-primary/50 border-2 shadow-xl shadow-primary/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="font-headline text-xl">
                        Équipes présélectionnées (finalistes)
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Prépare la liste des équipes présélectionnées avant de la publier
                        pour les participants.
                      </p>
                    </div>
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Équipe finaliste</TableHead>
                          <TableHead>Projet</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="w-[110px]">
                              <Input
                                type="number"
                                min={1}
                                max={3}
                                value={r.position}
                                onChange={(e) => {
                                  const value = Number(e.target.value) as 1 | 2 | 3;
                                  setResults((prev) =>
                                    prev.map((item) =>
                                      item.id === r.id ? { ...item, position: value } : item
                                    )
                                  );
                                }}
                                className="w-20 text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={r.teamName}
                                onChange={(e) =>
                                  setResults((prev) =>
                                    prev.map((item) =>
                                      item.id === r.id
                                        ? { ...item, teamName: e.target.value }
                                        : item
                                    )
                                  )
                                }
                                placeholder="Nom de l'équipe finaliste"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={r.projectName}
                                onChange={(e) =>
                                  setResults((prev) =>
                                    prev.map((item) =>
                                      item.id === r.id
                                        ? { ...item, projectName: e.target.value }
                                        : item
                                    )
                                  )
                                }
                                placeholder="Nom du projet présenté"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-between items-center gap-4 flex-wrap">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setResults((prev) => {
                            const nextId =
                              prev.length > 0
                                ? Math.max(...prev.map((item) => item.id)) + 1
                                : 1;
                            const nextPosition =
                              (prev.length + 1) as 1 | 2 | 3;
                            return [
                              ...prev,
                              {
                                id: nextId,
                                teamName: "",
                                projectName: "",
                                position: nextPosition > 3 ? 3 : nextPosition,
                              },
                            ];
                          });
                        }}
                      >
                        Ajouter une équipe finaliste
                      </Button>
                      <p className="text-xs text-muted-foreground max-w-md text-right">
                        Astuce : utilise ce tableau pour saisir ou corriger la liste des
                        équipes présélectionnées avant de la rendre visible côté
                        participants.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full flex flex-col justify-between border-primary/40">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">
                      Publication de la liste de présélection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Cette action publie la liste des équipes présélectionnées (finalistes)
                      côté participants sur la page publique <code>/results</code>.
                    </p>
                    <Button
                      className="w-full flex items-center gap-2"
                      onClick={handlePublish}
                      disabled={published}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {published
                        ? "Résultats déjà publiés"
                        : "Publier les résultats"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Note: actuellement, les données d'inscriptions et de résultats sont
                      simulées côté client (mock). Pour un vrai hackathon en production,
                      il faudra connecter cette interface à une API ou une base de
                      données.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
