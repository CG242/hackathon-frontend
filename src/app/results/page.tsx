'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackgroundParticles from '@/components/background-particles';
import { useWinners } from '@/context/winners-context';
import { useProjects } from '@/context/projects-context';
import { useInscriptions } from '@/context/inscriptions-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, CheckCircle, Users as UsersIcon } from 'lucide-react';
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
        <p className="text-muted-foreground text-sm h-12">{description}</p>
        <div className="mt-4">
            <h4 className="font-semibold text-sm flex items-center justify-center gap-2 mb-2">
                Équipe
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {team.map(member => (
                    <span key={member} className="text-xs bg-primary/10 text-primary-foreground/80 px-2 py-1 rounded-full">{member}</span>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ResultsPage() {
  const { winners, areResultsPublished, preselected, arePreselectionsPublished } = useWinners();
  const { projects } = useProjects();
  const { inscriptions } = useInscriptions();

  const getProjectByName = (name: string) => projects.find((p) => p.name === name);

  const winnerProjectsData = {
    first: getProjectByName(winners.first),
    second: getProjectByName(winners.second),
    third: getProjectByName(winners.third),
  };

  const preselectedParticipants = inscriptions.filter(i => preselected.includes(i.email));

  const areAnyResultsPublished = areResultsPublished || arePreselectionsPublished;
  const arePodiumResultsPublished = areResultsPublished && (winnerProjectsData.first || winnerProjectsData.second || winnerProjectsData.third) && (winners.first !== 'none' || winners.second !== 'none' || winners.third !== 'none');
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
              {areAnyResultsPublished ? 'Félicitations à tous les participants !' : 'Les résultats seront bientôt annoncés. Revenez plus tard !'}
            </p>
          </div>
        </section>

        {areAnyResultsPublished ? (
          <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32 -mt-16">
            {arePodiumResultsPublished && (
              <div className="mb-24">
                  <h2 className="text-3xl font-bold font-headline text-center mb-12">Podium des Projets</h2>
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                      {winnerProjectsData.second && winners.second !== 'none' && (
                          <div className="flex justify-center md:order-1">
                              <WinnerCard
                                  place="2ème"
                                  projectName={winnerProjectsData.second.name}
                                  team={winnerProjectsData.second.team}
                                  description={winnerProjectsData.second.description}
                              />
                          </div>
                      )}
                      {winnerProjectsData.first && winners.first !== 'none' && (
                          <div className="flex justify-center md:order-2">
                              <WinnerCard
                                  place="1ère"
                                  projectName={winnerProjectsData.first.name}
                                  team={winnerProjectsData.first.team}
                                  description={winnerProjectsData.first.description}
                              />
                          </div>
                      )}
                      {winnerProjectsData.third && winners.third !== 'none' && (
                          <div className="flex justify-center md:order-3">
                              <WinnerCard
                                  place="3ème"
                                  projectName={winnerProjectsData.third.name}
                                  team={winnerProjectsData.third.team}
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
                <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UsersIcon/>Participants Qualifiés</CardTitle>
                    <CardDescription>Félicitations aux participants qui continuent l'aventure !</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {preselectedParticipants.map((participant, index) => (
                        <li key={`${participant.email}-${index}`} className="flex items-center gap-3 bg-background/50 p-3 rounded-md">
                           <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                           <span className="font-medium">{participant.fullName}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {!arePodiumResultsPublished && !arePreselectionResultsPublished && (
                <div className="text-center text-muted-foreground py-16">
                    <p>Aucun résultat n'est publié pour le moment.</p>
                </div>
            )}

          </section>
        ) : null}

      </main>
      <Footer />
    </div>
  );
}
