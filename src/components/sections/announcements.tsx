 "use client";
import React from "react";
import { useAnnouncements } from "@/context/announcements-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const AnnouncementsSection: React.FC = () => {
  const { announcements, loading } = useAnnouncements();

  if (loading) {
    return (
      <section className="py-12">
        <Card>
          <CardHeader>
            <CardTitle>Annonces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </section>
    );
  }

  const publics = (announcements || [])
    .filter((a) => a.cible === "PUBLIC")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (publics.length === 0) {
    return (
      <section id="announcements" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Annonces</CardTitle>
              <CardDescription>
                Restez informés des dernières nouvelles du hackathon
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Aucune annonce pour le moment.
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Dernières annonces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Restez informés des dernières nouvelles et mises à jour du hackathon
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {publics.slice(0, 6).map((a, index) => {
            const isRecent = new Date(a.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h
            return (
              <Card
                key={a.id}
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-l-4 border-l-primary/50 hover:border-l-primary bg-card hover:bg-card/95 transform hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      {isRecent && (
                        <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600 animate-pulse">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                    </time>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {a.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                    {a.contenu}
                  </p>
                  <div className="mt-4 pt-3 border-t border-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Publié le {new Date(a.createdAt).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AnnouncementsSection;

