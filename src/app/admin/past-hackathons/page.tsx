import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pastEditions = [
    {
        year: "2025",
        theme: "IA & Santé",
        winner: "Projet Med-Bot",
        participants: 180,
        projects: 45,
    },
    {
        year: "2024",
        theme: "Fintech Durable",
        winner: "Eco-Pay",
        participants: 150,
        projects: 38,
    },
    {
        year: "2023",
        theme: "Smart City",
        winner: "City-Flow",
        participants: 120,
        projects: 30,
    }
]

export default function PastHackathonsPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Hackathons Passés</h1>
                    <p className="text-muted-foreground">
                        Archive et résultats des éditions précédentes du hackathon.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {pastEditions.map((edition) => (
                        <Card key={edition.year}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="font-headline text-2xl">Hackathon {edition.year}</CardTitle>
                                    <Badge variant="outline">{edition.theme}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vainqueur</p>
                                    <p className="font-semibold">{edition.winner}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">{edition.participants} Participants</p>
                                    <p className="text-muted-foreground">{edition.projects} Projets</p>
                                </div>
                                <Button variant="secondary" className="w-full">Voir les détails</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
