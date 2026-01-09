'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { authApi, User, LoginResponse } from '@/lib/api';

type AuthUser = {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
    nom?: string;
    prenom?: string;
    access_token?: string;
};

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        const loadUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    // Vérifier si le token est toujours valide en récupérant le profil
                    try {
                        const profile = await authApi.getProfile();
                        setUser({
                            ...profile,
                            access_token: parsedUser.access_token,
                        });
                    } catch (error) {
                        // Token invalide, déconnexion
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } catch (error) {
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response: LoginResponse = await authApi.login({ email, password });
            
            const userData: AuthUser = {
                ...response.user,
                access_token: response.access_token,
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error: any) {
            // Améliorer la gestion d'erreur pour afficher plus d'informations
            const errorMessage = error?.message || error?.error || error?.toString() || 'Erreur inconnue';
            const errorDetails = error?.response?.data || error?.data || {};
            console.error('Erreur de connexion:', {
                message: errorMessage,
                details: errorDetails,
                status: error?.status || error?.statusCode,
                fullError: error
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const refreshUser = async () => {
        try {
            const profile = await authApi.getProfile();
            const storedUser = localStorage.getItem('user');
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            
            if (parsedUser) {
                const userData: AuthUser = {
                    ...profile,
                    access_token: parsedUser.access_token,
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            logout();
        }
    };
    
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
