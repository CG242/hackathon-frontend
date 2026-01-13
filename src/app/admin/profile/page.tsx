'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Shield, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // États pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Charger le profil
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Utiliser directement l'API admin
      const data = await adminApi.getProfile();
      setProfile(data);
      setEditForm({
        nom: data.nom || '',
        prenom: data.prenom || '',
        email: data.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger le profil',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    // Validation
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    if (editForm.newPassword && !editForm.currentPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe actuel est requis pour changer le mot de passe',
      });
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        nom: editForm.nom,
        prenom: editForm.prenom,
        email: editForm.email,
      };

      if (editForm.newPassword) {
        (updateData as any).currentPassword = editForm.currentPassword;
        (updateData as any).newPassword = editForm.newPassword;
      }

      const updatedProfile = await adminApi.updateProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);

      // Reset password fields
      setEditForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le profil',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Impossible de charger le profil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations du profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos informations de base et rôle dans le système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rôle</p>
                <Badge variant={profile.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {profile.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Membre depuis</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Édition du profil */}
        <Card>
          <CardHeader>
            <CardTitle>Modifier le profil</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={editForm.nom}
                        onChange={(e) => setEditForm(prev => ({ ...prev, nom: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        value={editForm.prenom}
                        onChange={(e) => setEditForm(prev => ({ ...prev, prenom: e.target.value }))}
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel (optionnel)</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={editForm.currentPassword}
                    onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Requis pour changer le mot de passe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Laisser vide pour ne pas changer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmer</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Annuler
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nom complet</Label>
                    <p className="text-lg">{profile.prenom} {profile.nom}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg">{profile.email}</p>
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Modifier le profil
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
