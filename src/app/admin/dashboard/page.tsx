'use client';

import StatsCards from "@/components/admin/dashboard/stats-cards";
import InscriptionsChart from "@/components/admin/dashboard/inscriptions-chart";
import PromotionChart from "@/components/admin/dashboard/promotion-chart";
import { useInscriptions } from "@/context/inscriptions-context";
import { useEvent } from "@/context/event-context";
import { adminApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
    const { inscriptions, loading: loadingInscriptions } = useInscriptions();
    const { eventSettings, hackathon } = useEvent();
    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                const stats = await adminApi.getDashboard();
                console.log('✅ Statistiques du dashboard chargées:', stats);
                setDashboardStats(stats);
            } catch (error: any) {
                // Améliorer la gestion d'erreur pour afficher plus d'informations
                const errorMessage = error?.message || error?.error || 'Erreur inconnue';
                const errorDetails = error?.data || error?.response?.data || {};
                const statusCode = error?.statusCode || error?.status || error?.response?.status;
                
                console.error('Erreur lors du chargement du dashboard:', {
                    message: errorMessage,
                    details: errorDetails,
                    status: statusCode,
                    fullError: error
                });
                
                // Si c'est une erreur 401 ou 403, l'utilisateur n'est peut-être pas admin
                if (statusCode === 401) {
                    console.warn('⚠️ Non authentifié. Veuillez vous connecter.');
                } else if (statusCode === 403) {
                    console.warn('⚠️ Accès refusé. Vous devez être connecté en tant qu\'ADMIN pour accéder au dashboard.');
                    console.warn('💡 Connectez-vous avec : admin@hackathon.com / admin123');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const target = eventSettings.registrationGoal;
    // Le backend retourne "totalInscrits" pas "totalInscriptions"
    const totalInscriptions = dashboardStats?.totalInscrits || inscriptions.length;
    const inscriptionsToday = dashboardStats?.inscriptionsAujourdhui || 
        inscriptions.filter(i => {
            const date = new Date(i.createdAt);
            const today = new Date();
            return date.toDateString() === today.toDateString();
        }).length;

    if (loading || loadingInscriptions) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold font-headline">Tableau de bord</h1>
                <StatsCards 
                    totalInscriptions={totalInscriptions}
                    goalPercentage={target > 0 ? Math.round((totalInscriptions / target) * 100) : 0}
                    inscriptionsToday={inscriptionsToday}
                />
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <InscriptionsChart inscriptions={inscriptions} />
                    </div>
                    <div>
                        <PromotionChart 
                            inscriptions={inscriptions} 
                            promoStats={dashboardStats?.parPromo ? 
                                // Convertir l'array en Record pour le composant
                                dashboardStats.parPromo.reduce((acc: Record<string, number>, item: { promo: string; count: number }) => {
                                    acc[item.promo] = item.count;
                                    return acc;
                                }, {}) 
                                : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
