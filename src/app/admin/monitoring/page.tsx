'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const chartConfig = {
  cpu: { label: "CPU", color: "hsl(var(--primary))" },
  memory: { label: "Mémoire", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

const generateChartData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i * 2}min ago`,
    cpu: Math.floor(Math.random() * 50 + 10),
    memory: Math.floor(Math.random() * 40 + 20),
  }));
}

const generateLogs = () => {
    const levels = ["INFO", "WARN", "ERROR"];
    const messages = [
        "User authentication successful",
        "API rate limit exceeded for endpoint /api/users",
        "Database connection established",
        "New registration processed",
        "Failed to send email notification",
        "Server health check PASSED",
    ];
    return Array.from({length: 10}, () => {
        const level = levels[Math.floor(Math.random() * levels.length)];
        return {
            level,
            message: messages[Math.floor(Math.random() * messages.length)],
            timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 10).toLocaleTimeString()
        }
    })
}

export default function MonitoringPage() {
    const [chartData, setChartData] = useState<ReturnType<typeof generateChartData>>([]);
    const [logs, setLogs] = useState<ReturnType<typeof generateLogs>>([]);

    useEffect(() => {
        setChartData(generateChartData());
        setLogs(generateLogs());

        const interval = setInterval(() => {
            setChartData(generateChartData());
            setLogs(prevLogs => [
                ...generateLogs().slice(0, 1), 
                ...prevLogs
            ].slice(0, 20));
        }, 5000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Monitoring</h1>
                <p className="text-muted-foreground">
                    Surveillez l'état et les performances de l'application en temps réel.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">État du Serveur</CardTitle>
                            <span className="text-green-400 text-xs font-bold">● Opérationnel</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Healthy</div>
                            <p className="text-xs text-muted-foreground">Dernier check il y a 30s</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Latence API (ms)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45ms</div>
                            <p className="text-xs text-muted-foreground">Moyenne sur la dernière heure</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Taux d'erreur</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0.12%</div>
                            <p className="text-xs text-muted-foreground">Sur les 24 dernières heures</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Utilisation des Ressources</CardTitle>
                        <CardDescription>CPU et Mémoire en temps réel</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis unit="%" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        content={<ChartTooltipContent indicator="line" />}
                                        wrapperStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                                    />
                                    <Area type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" fill="url(#colorCpu)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="memory" stroke="hsl(var(--accent))" fill="url(#colorMemory)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Logs en direct</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-background/50 p-4 rounded-lg font-code text-xs h-64 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="text-muted-foreground mr-2">{log.timestamp}</span>
                                    <Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'outline'} className="mr-2 w-14 justify-center">{log.level}</Badge>
                                    <span>{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
