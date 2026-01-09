import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Code, Database, Share2 } from "lucide-react";
import Link from "next/link";

const docSections = [
    {
        icon: FileText,
        title: "Documentation Fonctionnelle",
        description: "Description détaillée des fonctionnalités du point de vue de l'utilisateur et de l'administrateur.",
        linkText: "Consulter",
        href: "#"
    },
    {
        icon: Code,
        title: "Documentation Technique",
        description: "Architecture du code, conventions, et guide pour les développeurs souhaitant contribuer ou maintenir le projet.",
        linkText: "Explorer le code",
        href: "#"
    },
    {
        icon: Database,
        title: "Schéma de l'API & de la Base de Données",
        description: "Détails sur les endpoints de l'API, les modèles de données et les relations en base de données.",
        linkText: "Voir les schémas",
        href: "#"
    },
    {
        icon: Share2,
        title: "Guide de Déploiement",
        description: "Instructions pas à pas pour déployer l'application sur un serveur de production.",
        linkText: "Lire le guide",
        href: "#"
    }
]

export default function DocsPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                 <div>
                    <h1 className="text-3xl font-bold font-headline">Documentation</h1>
                    <p className="text-muted-foreground">
                        Consultez la documentation technique et fonctionnelle de la plateforme.
                    </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    {docSections.map((section) => (
                        <Card key={section.title}>
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-full">
                                    <section.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>{section.title}</CardTitle>
                                    <CardDescription className="mt-1">{section.description}</CardDescription>
                                </div>
                            </CardHeader>
                             <CardContent>
                                <Link href={section.href} className="text-sm font-medium text-primary hover:underline">
                                    {section.linkText} &rarr;
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
