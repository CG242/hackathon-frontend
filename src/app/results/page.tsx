'use client';

import React, { useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackgroundParticles from '@/components/background-particles';
import { useWinners } from '@/context/winners-context';
import { useTeams } from '@/context/teams-context';
import { useInscriptions } from '@/context/inscriptions-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, CheckCircle, Users as UsersIcon, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resultatsApi } from '@/lib/api';
import { useEvent } from '@/context/event-context';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const WinnerCard = ({
  place,
  projectName,
  team,
  description,
}: {
  place: '1ère' | '2ème' | '3ème';
  projectName: string;
  team: string[];
  description: string;
}) => {
  const styles = {
    '1ère': {
      color: 'text-yellow-400',
      shadow: 'shadow-yellow-400/20',
      border: 'border-yellow-400/50',
      elevation: 'md:-translate-y-8 scale-105',
    },
    '2ème': {
      color: 'text-slate-300',
      shadow: 'shadow-slate-300/20',
      border: 'border-slate-300/50',
      elevation: 'md:mt-8',
    },
    '3ème': {
      color: 'text-yellow-600',
      shadow: 'shadow-yellow-600/20',
      border: 'border-yellow-600/50',
      elevation: 'md:mt-8',
    },
  };

  return (
    <Card
      className={cn(
        'bg-card/80 backdrop-blur-sm text-center transition-all duration-300 shadow-lg hover:shadow-xl w-full',
        styles[place].shadow,
        styles[place].border,
        styles[place].elevation
      )}
    >
      <CardHeader>
        <div className="mx-auto bg-background p-4 rounded-full border-2 border-primary/20 w-28 h-28 flex items-center justify-center">
          <Award className={cn('w-16 h-16', styles[place].color)} strokeWidth={1.5} />
        </div>
        <CardTitle className={cn('font-headline text-2xl pt-4', styles[place].color)}>{place} Place</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">{projectName}</h3>
        <div className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ResultsPage() {
  const { winners, areResultsPublished, preselected, arePreselectionsPublished, documentPreselectionsName, documentPreselectionsUrl, loading, refreshResults } = useWinners();
  const { teams } = useTeams();
  const { inscriptions } = useInscriptions();
  const { hackathon } = useEvent();
  
  // Recharger les résultats au montage
  useEffect(() => {
    refreshResults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownloadPreselectionsPdf = async () => {
    if (!hackathon?.id) return;

    try {
      const blob = await resultatsApi.downloadPreselectionsDocument(hackathon.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentPreselectionsName || `liste-preselectionnes-${hackathon.nom}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
    }
  };

  // Les résultats du backend contiennent les noms des projets (strings)
  // Chercher l'équipe correspondante dans la liste des équipes
  const getProjectData = (projectName: string) => {
    if (projectName === 'none' || !projectName) return null;
    
    // Chercher une équipe avec ce nom de projet
    const team = teams.find(t => t.projetNom === projectName);
    
    if (team) {
      // Retourner les données de l'équipe avec les membres
      return {
        name: team.projetNom || team.nom,
        description: team.description || 'Projet gagnant du hackathon',
        team: team.members.map(m => `${m.user.prenom} ${m.user.nom}`),
        tags: []
      };
    }
    
    // Si aucune équipe trouvée, retourner juste le nom du projet
    return {
      name: projectName,
      description: 'Projet gagnant du hackathon',
      team: [],
      tags: []
    };
  };

  const winnerProjectsData = {
    first: getProjectData(winners.first),
    second: getProjectData(winners.second),
    third: getProjectData(winners.third),
  };

  const preselectedParticipants = inscriptions.filter(i => {
    const email = i.user?.email || '';
    return email ? preselected.includes(email) : false;
  });

  const areAnyResultsPublished = areResultsPublished || arePreselectionsPublished;
  // Vérifier si au moins un gagnant est défini (pas 'none' et pas null/undefined)
  const hasWinners = (winners.first && winners.first !== 'none') || 
                     (winners.second && winners.second !== 'none') || 
                     (winners.third && winners.third !== 'none');
  const arePodiumResultsPublished = areResultsPublished && hasWinners;
  const arePreselectionResultsPublished = arePreselectionsPublished && preselectedParticipants.length > 0;





  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <section className="relative flex flex-col items-center justify-center min-h-[calc(50vh)] overflow-hidden py-16">
          <BackgroundParticles />
          <div className="relative z-10 text-center px-4">
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              Résultats du Hackathon
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              {loading ? 'Chargement des résultats...' : areAnyResultsPublished ? 'Félicitations à tous les participants !' : 'Les résultats seront bientôt annoncés. Revenez plus tard !'}
            </p>
          </div>
        </section>

        {!loading && areAnyResultsPublished ? (
          <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32 -mt-16">
            {arePodiumResultsPublished && (
              <div className="mb-24">
                  <h2 className="text-3xl font-bold font-headline text-center mb-12">Podium des Projets</h2>
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                      {winners.second && winners.second !== 'none' && winnerProjectsData.second && (
                          <div className="flex justify-center md:order-1">
                              <WinnerCard
                                  place="2ème"
                                  projectName={winnerProjectsData.second.name}
                                  team={winnerProjectsData.second.team.length > 0 ? winnerProjectsData.second.team : ['Non spécifié']}
                                  description={winnerProjectsData.second.description}
                              />
                          </div>
                      )}
                      {winners.first && winners.first !== 'none' && winnerProjectsData.first && (
                          <div className="flex justify-center md:order-2">
                              <WinnerCard
                                  place="1ère"
                                  projectName={winnerProjectsData.first.name}
                                  team={winnerProjectsData.first.team.length > 0 ? winnerProjectsData.first.team : ['Non spécifié']}
                                  description={winnerProjectsData.first.description}
                              />
                          </div>
                      )}
                      {winners.third && winners.third !== 'none' && winnerProjectsData.third && (
                          <div className="flex justify-center md:order-3">
                              <WinnerCard
                                  place="3ème"
                                  projectName={winnerProjectsData.third.name}
                                  team={winnerProjectsData.third.team.length > 0 ? winnerProjectsData.third.team : ['Non spécifié']}
                                  description={winnerProjectsData.third.description}
                              />
                          </div>
                      )}
                  </div>
              </div>
            )}
            
            {arePodiumResultsPublished && arePreselectionResultsPublished && <Separator className="my-16 bg-border/50" />}

            {arePreselectionResultsPublished && (
              <div>
                <h2 className="text-3xl font-bold font-headline text-center mb-12">Liste des Présélectionnés</h2>
                {documentPreselectionsUrl && (
                  <div className="max-w-4xl mx-auto mb-6 flex justify-center">
                    <Button
                      onClick={handleDownloadPreselectionsPdf}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-5 w-5" />
                      Télécharger la liste complète (PDF)
                    </Button>
                  </div>
                )}
                {preselectedParticipants.length > 0 && (
                  <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><UsersIcon/>Participants Qualifiés</CardTitle>
                      <CardDescription>
                        {documentPreselectionsUrl 
                          ? 'Félicitations aux participants qui continuent l\'aventure ! Téléchargez le PDF pour la liste complète.'
                          : 'Félicitations aux participants qui continuent l\'aventure !'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {documentPreselectionsUrl && preselectedParticipants.length > 20 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            {preselectedParticipants.length} participant(s) présélectionné(s)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Téléchargez le PDF ci-dessus pour voir la liste complète.
                          </p>
                        </div>
                      ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {preselectedParticipants.slice(0, 50).map((participant, index) => {
                            const fullName = participant.user 
                              ? `${participant.user.prenom} ${participant.user.nom}`
                              : 'Participant';
                            const email = participant.user?.email || `participant-${index}`;
                            return (
                              <li key={`${email}-${index}`} className="flex items-center gap-3 bg-background/50 p-3 rounded-md">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="font-medium">{fullName}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {preselectedParticipants.length > 50 && !documentPreselectionsUrl && (
                        <p className="text-sm text-muted-foreground text-center mt-4">
                          ... et {preselectedParticipants.length - 50} autre(s) participant(s)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!arePodiumResultsPublished && !arePreselectionResultsPublished && areAnyResultsPublished && (
                <div className="text-center text-muted-foreground py-16">
                    <p>Les résultats sont publiés mais aucun détail n'est disponible pour le moment.</p>
                </div>
            )}

          </section>
        ) : !loading ? (
          <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32 -mt-16">
            <div className="text-center text-muted-foreground py-16">
              <p>Les résultats ne sont pas encore publiés.</p>
            </div>
          </section>
        ) : null}

      </main>
      <Footer />
    </div>
  );
}
