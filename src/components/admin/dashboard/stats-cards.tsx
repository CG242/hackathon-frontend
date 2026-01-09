"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEvent } from "@/context/event-context";

const StatCard = ({ icon: Icon, title, value, evolution, children }: { icon: React.ElementType, title: string, value: string, evolution: string, children?: React.ReactNode }) => {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline">{value}</div>
                <p className="text-xs text-muted-foreground">{evolution}</p>
                <div className="mt-4">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

export default function StatsCards({ totalInscriptions, goalPercentage, inscriptionsToday }: { totalInscriptions: number; goalPercentage: number; inscriptionsToday: number; }) {
    const { eventSettings } = useEvent();
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} title="Total Inscriptions" value={String(totalInscriptions)} evolution="+12% vs semaine dernière">
            </StatCard>
            <StatCard icon={Target} title="Objectif Atteint" value={`${goalPercentage}%`} evolution={`Objectif: ${eventSettings.registrationGoal}`}>
                <Progress value={goalPercentage} className="h-2 mt-2" />
            </StatCard>
            <StatCard icon={Calendar} title="Inscriptions Aujourd'hui" value={String(inscriptionsToday)} evolution="+5 dernière heure">
            </StatCard>
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Prochain jalon</CardTitle>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">Annonce des équipes</div>
                    <p className="text-xs text-muted-foreground">Dans 3 jours</p>
                </CardContent>
            </Card>
        </div>
    );
}
