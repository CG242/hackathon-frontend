"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import { Inscription } from "@/lib/api";

const chartConfig = {
    l1: { label: "L1", color: "hsl(var(--chart-1))" },
    l2: { label: "L2", color: "hsl(var(--chart-2))" },
    other: { label: "Non spécifié", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

const groupInscriptionsByPromo = (inscriptions: Inscription[], promoStats?: Record<string, number>) => {
    // Si on a des stats depuis l'API, les utiliser
    if (promoStats) {
        return Object.entries(promoStats).map(([promo, value]) => ({
            name: promo.toUpperCase(),
            value,
            fill: chartConfig[promo.toLowerCase() as keyof typeof chartConfig]?.color || chartConfig.other.color
        }));
    }

    // Sinon, calculer depuis les inscriptions
    const groups: Record<string, number> = {
        l1: 0,
        l2: 0,
        other: 0,
    };

    inscriptions.forEach(inscription => {
        const promo = inscription.promo?.toLowerCase();
        if (promo === 'l1') groups.l1++;
        else if (promo === 'l2') groups.l2++;
        else groups.other++;
    });

    return Object.entries(groups).map(([name, value]) => ({
        name: chartConfig[name as keyof typeof chartConfig].label,
        value,
        fill: chartConfig[name as keyof typeof chartConfig]?.color || chartConfig.other.color
    }));
};

export default function PromotionChart({ inscriptions, promoStats }: { inscriptions: Inscription[], promoStats?: Record<string, number> }) {
    const data = useMemo(() => groupInscriptionsByPromo(inscriptions, promoStats), [inscriptions, promoStats]);
    const totalParticipants = inscriptions.length;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg h-full">
            <CardHeader>
                <CardTitle>Répartition par Promotion</CardTitle>
                <CardDescription>Visualisation des participants par classe</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] relative">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <PieChart>
                            <Tooltip
                                content={<ChartTooltipContent />}
                                wrapperStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                    color: 'hsl(var(--foreground))',
                                }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius="60%"
                                outerRadius="80%"
                                dataKey="value"
                                nameKey="name"
                                stroke="hsl(var(--background))"
                                strokeWidth={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold font-headline">{totalParticipants}</span>
                        <span className="text-sm text-muted-foreground">Participants</span>
                    </div>
                </div>
                 <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                    {data.filter(d => d.value > 0).map((entry) => {
                       const configKey = Object.keys(chartConfig).find(key => chartConfig[key as keyof typeof chartConfig].label === entry.name);
                       if(!configKey) return null;
                       const config = chartConfig[configKey as keyof typeof chartConfig];
                       
                        return (
                            <div key={entry.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></span>
                                <span>{config.label} ({entry?.value})</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
