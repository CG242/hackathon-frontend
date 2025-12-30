import StatsCards from "@/components/admin/dashboard/stats-cards";
import InscriptionsChart from "@/components/admin/dashboard/inscriptions-chart";
import PromotionChart from "@/components/admin/dashboard/promotion-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Tableau de bord</h1>
                <StatsCards />
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <InscriptionsChart />
                    </div>
                    <div>
                        <PromotionChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
