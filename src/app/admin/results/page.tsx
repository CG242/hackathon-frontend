'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/context/projects-context';
import { useWinners } from '@/context/winners-context';
import { useInscriptions } from '@/context/inscriptions-context';
import { useToast } from '@/hooks/use-toast';
import { Award, Trophy, Users, ListChecks } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const WinnerSelect = ({
  label,
  projects,
  selectedValue,
  onValueChange,
  otherWinners,
}: {
  label: string;
  projects: { name: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  otherWinners: string[];
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 font-semibold">
        <Trophy
          className={`h-5 w-5 ${
            label === '1ère Place'
              ? 'text-yellow-400'
              : label === '2ème Place'
              ? 'text-slate-300'
              : 'text-yellow-600'
          }`}
        />
        {label}
      </Label>
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un projet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Aucun</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.name} value={project.name} disabled={otherWinners.includes(project.name)}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function ResultsAdminPage() {
  const { projects } = useProjects();
  const { inscriptions } = useInscriptions();
  const { 
    winners, setWinners, publishResults, areResultsPublished,
    preselected, setPreselected, arePreselectionsPublished, publishPreselections
  } = useWinners();
  const { toast } = useToast();

  const [firstPlace, setFirstPlace] = useState(winners.first || 'none');
  const [secondPlace, setSecondPlace] = useState(winners.second || 'none');
  const [thirdPlace, setThirdPlace] = useState(winners.third || 'none');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(preselected);

  const handlePublishWinners = () => {
    setWinners({
      first: firstPlace,
      second: secondPlace,
      third: thirdPlace,
    });
    publishResults(true);
    toast({
      title: 'Résultats Publiés !',
      description: 'Les gagnants sont maintenant visibles sur la page des résultats.',
    });
  };

  const handleUnpublishWinners = () => {
     publishResults(false);
     toast({
      title: 'Résultats dépubliés',
      description: 'La page des gagnants est de nouveau masquée.',
      variant: 'destructive',
    });
  }

  const handlePublishPreselections = () => {
    setPreselected(selectedParticipants);
    publishPreselections(true);
    toast({
      title: 'Présélections Publiées !',
      description: 'La liste des présélectionnés est visible sur la page des résultats.',
    });
  };

  const handleUnpublishPreselections = () => {
     publishPreselections(false);
     toast({
      title: 'Présélections dépubliées',
      description: 'La liste des présélectionnés est maintenant masquée.',
      variant: 'destructive',
    });
  };

  const handleParticipantSelect = (email: string) => {
    setSelectedParticipants(prev => 
      prev.includes(email) ? prev.filter(p => p !== email) : [...prev, email]
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Publication des Résultats</h1>
        <p className="text-muted-foreground">Sélectionnez les projets gagnants et les participants présélectionnés.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award />
              Podium du Hackathon
            </CardTitle>
            <CardDescription>
              Choisissez les projets pour les trois premières places.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <WinnerSelect
              label="1ère Place"
              projects={projects}
              selectedValue={firstPlace}
              onValueChange={setFirstPlace}
              otherWinners={[secondPlace, thirdPlace]}
            />
            <WinnerSelect
              label="2ème Place"
              projects={projects}
              selectedValue={secondPlace}
              onValueChange={setSecondPlace}
              otherWinners={[firstPlace, thirdPlace]}
            />
            <WinnerSelect
              label="3ème Place"
              projects={projects}
              selectedValue={thirdPlace}
              onValueChange={setThirdPlace}
              otherWinners={[firstPlace, secondPlace]}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
              {areResultsPublished && (
                  <Button variant="outline" onClick={handleUnpublishWinners}>Dépublier</Button>
              )}
              <Button onClick={handlePublishWinners}>
                  {areResultsPublished ? "Mettre à jour" : "Publier le podium"}
              </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks />
              Participants Présélectionnés
            </CardTitle>
            <CardDescription>
              Cochez les participants qui passent à l'étape suivante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <div className="space-y-4">
                {inscriptions.map((inscription, index) => (
                  <div key={`${inscription.email}-${index}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${inscription.email}-${index}`}
                      checked={selectedParticipants.includes(inscription.email)}
                      onCheckedChange={() => handleParticipantSelect(inscription.email)}
                    />
                    <label
                      htmlFor={`${inscription.email}-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {inscription.fullName} ({inscription.email})
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
              {arePreselectionsPublished && (
                  <Button variant="outline" onClick={handleUnpublishPreselections}>Dépublier</Button>
              )}
              <Button onClick={handlePublishPreselections}>
                  {arePreselectionsPublished ? "Mettre à jour" : "Publier la liste"}
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
