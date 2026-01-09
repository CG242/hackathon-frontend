'use client';

import StatsCards from "@/components/admin/dashboard/stats-cards";
import InscriptionsChart from "@/components/admin/dashboard/inscriptions-chart";
import PromotionChart from "@/components/admin/dashboard/promotion-chart";
import { useInscriptions } from "@/context/inscriptions-context";
import { useEvent } from "@/context/event-context";

export default function AdminDashboardPage() {
    const { inscriptions } = useInscriptions();
    const { eventSettings } = useEvent();
    
    const target = eventSettings.registrationGoal;
    const inscriptionsToday = inscriptions.filter(i => new Date(i.date).toDateString() === new Date().toDateString()).length;


    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Tableau de bord</h1>
                <StatsCards 
                    totalInscriptions={inscriptions.length}
                    goalPercentage={target > 0 ? Math.round((inscriptions.length / target) * 100) : 0}
                    inscriptionsToday={inscriptionsToday}
                />
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <InscriptionsChart inscriptions={inscriptions} />
                    </div>
                    <div>
                        <PromotionChart inscriptions={inscriptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
