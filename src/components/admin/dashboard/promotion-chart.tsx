"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart";

const data = [
    { name: 'LIC1', value: 135, fill: 'var(--color-lic1)' },
    { name: 'LIC2', value: 165, fill: 'var(--color-lic2)' },
    { name: 'LRT', value: 110, fill: 'var(--color-lrt)' },
    { name: 'LRT 2', value: 90, fill: 'var(--color-lrt2)' }
];

const chartConfig = {
    lic1: { label: "LIC1", color: "hsl(var(--chart-1))" },
    lic2: { label: "LIC2", color: "hsl(var(--chart-2))" },
    lrt: { label: "LRT", color: "hsl(var(--chart-3))" },
    lrt2: { label: "LRT 2", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

export default function PromotionChart() {
    const totalParticipants = data.reduce((acc, entry) => acc + entry.value, 0);

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
                    {Object.entries(chartConfig).map(([key, config]) => {
                        const entry = data.find(d => d.name.toLowerCase().replace(' ', '') === key);
                        return (
                            <div key={key} className="flex items-center gap-2">
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