"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Target, Calendar, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const TinyChart = () => (
    <div className="w-full h-10">
        <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area 
                    type="monotone" 
                    dataKey="uv" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUv)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const HourlyBars = () => {
    const [heights, setHeights] = useState<number[]>([]);
    
    useEffect(() => {
        setHeights(Array.from({ length: 24 }, () => Math.random() * 90 + 10));
    }, []);

    if (heights.length === 0) {
        // Render a placeholder or nothing on server and initial client render
        return <div className="w-full h-12 bg-muted/50 rounded-md mt-2 flex items-end gap-[2px] p-1" />;
    }

    return (
        <div className="w-full h-12 bg-muted/50 rounded-md mt-2 flex items-end gap-[2px] p-1">
            {heights.map((height, i) => (
                <div key={i} className="bg-accent/80 w-full rounded-t-sm" style={{height: `${height}%`}}></div>
            ))}
        </div>
    );
};


const StatCard = ({ icon: Icon, title, value, evolution, footer, children }: { icon: React.ElementType, title: string, value: string, evolution: string, footer?: React.ReactNode, children?: React.ReactNode }) => {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline">{value}</div>
                <p className="text-xs text-green-400">{evolution}</p>
                <div className="mt-4">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

export default function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} title="Total Inscriptions" value="201" evolution="+12% vs semaine dernière">
                <TinyChart />
            </StatCard>
            <StatCard icon={Target} title="Objectif Atteint" value="67%" evolution="J-15 restants">
                <Progress value={67} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Prédiction IA : Objectif atteignable à 85%</p>
            </StatCard>
            <StatCard icon={Calendar} title="Inscriptions Aujourd'hui" value="23" evolution="+5 dernière heure">
                <HourlyBars />
            </StatCard>
            <StatCard icon={CheckCircle2} title="Taux de Complétion" value="92%" evolution="24 profils incomplets">
                <div className="relative w-24 h-24 mx-auto mt-2">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/20"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="text-green-500"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="92, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-headline text-2xl">92%</div>
                </div>
            </StatCard>
        </div>
    );
}