'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeams } from '@/context/teams-context';
import { useWinners } from '@/context/winners-context';
import { useInscriptions } from '@/context/inscriptions-context';
import { useToast } from '@/hooks/use-toast';
import { Award, Trophy, Users, ListChecks, CheckCircle, Edit, Upload, FileText, Loader2, FileUp, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { resultatsApi } from '@/lib/api';
import { useEvent } from '@/context/event-context';
import { cn } from '@/lib/utils';

const WinnerSelect = ({
  label,
  teams,
  selectedValue,
  onValueChange,
  otherWinners,
}: {
  label: string;
  teams: Array<{ projetNom?: string; nom: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
  otherWinners: string[];
}) => {
  // Extraire les noms de projets depuis les équipes (projetNom ou nom si pas de projetNom)
  const projectNames = teams.map(team => team.projetNom || team.nom).filter(Boolean) as string[];
  
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
          {projectNames.map((projectName) => (
            <SelectItem key={projectName} value={projectName} disabled={otherWinners.includes(projectName)}>
              {projectName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function ResultsAdminPage() {
  const { teams } = useTeams();
  const { inscriptions } = useInscriptions();
  const { hackathon } = useEvent();
  const { 
    winners, setWinners, publishResults, areResultsPublished,
    preselected, setPreselected, arePreselectionsPublished, publishPreselections, refreshResults
  } = useWinners();
  const { toast } = useToast();

  const [firstPlace, setFirstPlace] = useState(winners.first || 'none');
  const [secondPlace, setSecondPlace] = useState(winners.second || 'none');
  const [thirdPlace, setThirdPlace] = useState(winners.third || 'none');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(preselected);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Mettre à jour les états locaux quand les winners changent
  useEffect(() => {
    setFirstPlace(winners.first || 'none');
    setSecondPlace(winners.second || 'none');
    setThirdPlace(winners.third || 'none');
  }, [winners]);

  // Mettre à jour les participants sélectionnés quand preselected change
  useEffect(() => {
    setSelectedParticipants(preselected);
  }, [preselected]);

  const handlePublishWinners = async (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const newWinners = {
      first: firstPlace,
      second: secondPlace,
      third: thirdPlace,
    };
    
    // Vérifier qu'au moins un gagnant est sélectionné
    const hasAtLeastOneWinner = firstPlace !== 'none' || secondPlace !== 'none' || thirdPlace !== 'none';
    
    if (!hasAtLeastOneWinner) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez sélectionner au moins un gagnant pour publier le podium.',
      });
      return;
    }
    
    try {
      
      // Publier directement avec les nouveaux winners (le toast est géré dans publishResults)
      await publishResults(true, newWinners);
      
      // Mettre à jour les états locaux après publication
      setFirstPlace(newWinners.first);
      setSecondPlace(newWinners.second);
      setThirdPlace(newWinners.third);
      
      toast({
        title: 'Résultats Publiés !',
        description: 'Les gagnants sont maintenant visibles sur la page des résultats.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de publier les résultats.',
      });
    }
  };

  const handleUnpublishWinners = async () => {
    try {
      await publishResults(false);
      toast({
        title: 'Résultats dépubliés',
        description: 'La page des gagnants est de nouveau masquée.',
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de dépublier les résultats.',
      });
    }
  }

  const handlePublishPreselections = async () => {
    try {
      
      // Publier directement avec les participants sélectionnés
      await publishPreselections(true, selectedParticipants);
      
      toast({
        title: 'Présélections Publiées !',
        description: 'La liste des présélectionnés est visible sur la page des résultats.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de publier les présélections.',
      });
    }
  };

  const handleUnpublishPreselections = async () => {
    try {
      await publishPreselections(false);
      toast({
        title: 'Présélections dépubliées',
        description: 'La liste des présélectionnés est maintenant masquée.',
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de dépublier les présélections.',
      });
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le fichier doit être un PDF.',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le fichier PDF ne doit pas dépasser 10 MB.',
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
  };

  const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const processUpload = async () => {
    if (!selectedFile || !hackathon?.id) return;

    setUploadingPdf(true);
    setUploadStatus('Préparation du fichier...');

    try {
      setUploadStatus('Analyse du PDF en cours...');
      const result = await resultatsApi.uploadPreselectionsDocument(hackathon.id, selectedFile);

      setUploadStatus(`✅ ${result.matchedCount} participant(s) trouvé(s) et pré-sélectionné(s).`);

      toast({
        title: 'PDF traité avec succès',
        description: `${result.matchedCount} participant(s) trouvé(s) et pré-sélectionné(s) automatiquement.`,
      });

      // Pré-cocher automatiquement les participants trouvés
      if (result.preselectionnes && result.preselectionnes.length > 0) {
        setSelectedParticipants(result.preselectionnes);
        await setPreselected(result.preselectionnes);
      }

      // Réinitialiser
      setSelectedFile(null);

    } catch (error: any) {
      setUploadStatus('❌ Erreur pendant l\'analyse du PDF.');
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error?.message || 'Impossible de traiter le PDF.',
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
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
              teams={teams}
              selectedValue={firstPlace}
              onValueChange={setFirstPlace}
              otherWinners={[secondPlace, thirdPlace]}
            />
            <WinnerSelect
              label="2ème Place"
              teams={teams}
              selectedValue={secondPlace}
              onValueChange={setSecondPlace}
              otherWinners={[firstPlace, thirdPlace]}
            />
            <WinnerSelect
              label="3ème Place"
              teams={teams}
              selectedValue={thirdPlace}
              onValueChange={setThirdPlace}
              otherWinners={[firstPlace, secondPlace]}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
              <div>
                  {areResultsPublished && (
                      <Badge variant="default" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Publié
                      </Badge>
                  )}
              </div>
              <div className="flex gap-4">
                  {areResultsPublished && (
                      <Button variant="outline" onClick={handleUnpublishWinners}>
                          Dépublier
                      </Button>
                  )}
                  <Button onClick={handlePublishWinners}>
                      {areResultsPublished ? "Modifier" : "Publier le podium"}
                  </Button>
              </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks />
              Participants Présélectionnés
            </CardTitle>
            <CardDescription>
              Cochez les participants qui passent à l'étape suivante. Vous pouvez aussi uploader un PDF pour extraire automatiquement les participants.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Section Upload PDF avec drag & drop */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Upload PDF des présélectionnés</h3>
              </div>

              {/* Zone de drop avec drag & drop */}
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer",
                  dragActive
                    ? "border-primary bg-primary/5 scale-105"
                    : selectedFile
                    ? "border-green-500 bg-green-50"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !selectedFile && document.getElementById('pdf-upload')?.click()}
              >
                {selectedFile ? (
                  /* Fichier sélectionné */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!uploadingPdf && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            processUpload();
                          }}
                          className="flex items-center gap-2"
                        >
                          <FileUp className="h-4 w-4" />
                          Traiter
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Zone de drop vide */
                  <div className="text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {dragActive ? "Déposez votre PDF ici" : "Glissez-déposez votre PDF ici"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ou <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('pdf-upload')?.click();
                          }}
                        >
                          sélectionnez un fichier
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Input caché */}
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleUploadPdf}
                  disabled={uploadingPdf || !hackathon?.id}
                  className="hidden"
                />
              </div>

              {/* Indicateur de chargement */}
              {uploadingPdf && (
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Analyse du PDF en cours...</p>
                    <p className="text-xs text-muted-foreground">Extraction automatique des participants</p>
                  </div>
                </div>
              )}

              {/* Status de l'upload */}
              {!uploadingPdf && uploadStatus && (
                <div className={cn(
                  "p-3 rounded-lg text-sm",
                  uploadStatus.includes('✅')
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : uploadStatus.includes('❌')
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
                )}>
                  {uploadStatus}
                </div>
              )}

              {/* Informations */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Comment ça fonctionne ?
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Le PDF sera analysé automatiquement pour extraire les emails</li>
                  <li>• Les participants correspondants seront pré-sélectionnés</li>
                  <li>• Vous pourrez ajuster la sélection manuellement</li>
                  <li>• Format accepté : PDF uniquement (max 10 MB)</li>
                </ul>
              </div>
            </div>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <div className="space-y-4">
                {inscriptions
                  .filter(ins => ins.user?.email)
                  .map((inscription, index) => {
                    const email = inscription.user!.email;
                    const fullName = `${inscription.user!.prenom} ${inscription.user!.nom}`;
                    return (
                      <div key={`${email}-${index}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${email}-${index}`}
                          checked={selectedParticipants.includes(email)}
                          onCheckedChange={() => handleParticipantSelect(email)}
                        />
                        <label
                          htmlFor={`${email}-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {fullName}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              {arePreselectionsPublished && (
                <Badge variant="default" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Publié
                </Badge>
              )}
            </div>
            <div className="flex gap-4">
              {arePreselectionsPublished && (
                <Button variant="outline" onClick={handleUnpublishPreselections}>
                  Dépublier
                </Button>
              )}
              <Button onClick={handlePublishPreselections}>
                {arePreselectionsPublished ? "Modifier" : "Publier la liste"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
