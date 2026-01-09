"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useEffect, useState, useMemo } from "react";
import { type Inscription } from "@/components/registration-form";

const chartConfig = {
  cumulees: {
    label: "Inscriptions cumulées",
    color: "hsl(var(--primary))",
  },
  parJour: {
    label: "Inscriptions par jour",
    color: "hsl(var(--accent))",
  },
  prediction: {
    label: "Prédiction IA",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

const generateDataForLastNDays = (inscriptions: Inscription[], days: number) => {
    const data = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateString = date.toISOString().split('T')[0];
        return {
            date: `Jour ${i + 1}`,
            fullDate: dateString,
            parJour: 0,
            cumulees: 0,
            prediction: 0,
        };
    });

    let cumulativeTotal = 0;
    inscriptions.forEach(inscription => {
        const inscriptionDate = new Date(inscription.date).toISOString().split('T')[0];
        const dayData = data.find(d => d.fullDate === inscriptionDate);
        if (dayData) {
            dayData.parJour += 1;
        }
    });

    data.forEach((d, index) => {
        if (index > 0) {
            cumulativeTotal += data[index-1].parJour;
        }
        d.cumulees = cumulativeTotal + d.parJour;
        // Simple prediction logic
        d.prediction = d.cumulees * (1 + (index/days) * 0.2);
    });

    return data;
};

export default function InscriptionsChart({ inscriptions }: { inscriptions: Inscription[] }) {
    const chartData = useMemo(() => generateDataForLastNDays(inscriptions, 30), [inscriptions]);

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Évolution des Inscriptions</CardTitle>
                        <CardDescription>30 derniers jours</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                 <defs>
                                    <linearGradient id="colorCumulees" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-cumulees)" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="var(--color-cumulees)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorParJour" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-parJour)" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="var(--color-parJour)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    content={<ChartTooltipContent indicator="line" />}
                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    wrapperStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        color: 'hsl(var(--foreground))',
                                    }}
                                />
                                <Area type="monotone" dataKey="cumulees" stroke="var(--color-cumulees)" fillOpacity={1} fill="url(#colorCumulees)" strokeWidth={2} />
                                <Area type="monotone" dataKey="parJour" stroke="var(--color-parJour)" fill="url(#colorParJour)" strokeWidth={2} />
                                <Area type="monotone" dataKey="prediction" stroke="var(--color-prediction)" strokeDasharray="5 5" fill="none" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
