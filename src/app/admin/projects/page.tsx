'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";

const mockProjects = [
    {
        name: "Projet Alpha",
        description: "Plateforme de gestion de projets innovante utilisant l'IA pour optimiser les tâches.",
        team: ["Alice", "Bob", "Charlie"],
        tags: ["IA", "Productivité", "Web"],
    },
    {
        name: "Eco-Tracker",
        description: "Application mobile pour suivre et réduire son empreinte carbone au quotidien.",
        team: ["David", "Eve", "Frank"],
        tags: ["Mobile", "Écologie", "Gamification"],
    },
    {
        name: "Health-Bot",
        description: "Un chatbot médical pour le diagnostic préliminaire et la prise de rendez-vous.",
        team: ["Grace", "Heidi", "Ivan"],
        tags: ["Santé", "Chatbot", "IA"],
    },
    {
        name: "Data-Viz",
        description: "Outil de visualisation de données en temps réel pour les marchés financiers.",
        team: ["Judy", "Mallory"],
        tags: ["Data", "Finance", "Web"],
    }
]

export default function ProjectsPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Projets & Équipes</h1>
                        <p className="text-muted-foreground">
                            Suivez la progression des projets et la composition des équipes.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map((project) => (
                        <Card key={project.name}>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <div className="flex gap-2 pt-2">
                                    {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{project.description}</CardDescription>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4" />
                                        Équipe
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {project.team.map(member => (
                                            <Avatar key={member} className="h-8 w-8">
                                                <AvatarFallback>{member.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
