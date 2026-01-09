'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useProjects } from "@/context/projects-context";

export default function ProjectsPage() {
    const { projects } = useProjects();
    return (
        <div className="flex flex-col h-full">
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
                    {projects.map((project) => (
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
