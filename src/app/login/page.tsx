'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth-context';
import { CodeXml, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminBackground from '@/components/admin/layout/admin-background';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await login(email, password);
            if (user.role !== 'ADMIN') {
                logout();
                toast({
                    variant: 'destructive',
                    title: 'Accès refusé',
                    description: 'Ce compte n’a pas le rôle ADMIN.',
                });
                return;
            }
            toast({
                title: 'Connexion réussie!',
                description: 'Bienvenue sur le tableau de bord.',
            });
            router.push('/admin/dashboard');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur de connexion',
                description: error?.message || 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-transparent p-4">
            <AdminBackground />
            <Card data-login-card className="w-full max-w-sm z-10 border-primary/50 border-2 shadow-xl shadow-primary/10 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <CodeXml className="w-10 h-10 text-primary" />
                        <h1 className="text-xl sm:text-2xl font-bold font-headline">CFI-CIRAS</h1>
                    </div>
                    <CardTitle className="font-headline text-2xl">Connexion Admin</CardTitle>
                    <CardDescription>Accédez à votre tableau de bord</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@hackathon.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}