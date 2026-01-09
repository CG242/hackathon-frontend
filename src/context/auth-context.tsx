'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type User = {
    email: string;
    role: 'admin';
};

export type AdminUser = User & { password?: string };

interface AuthContextType {
    user: User | null;
    users: AdminUser[];
    loading: boolean;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    addUser: (user: AdminUser) => void;
    removeUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: AdminUser[] = [
    { email: 'cfi-ciras@example.com', password: 'password', role: 'admin' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
            const storedUsers = localStorage.getItem('admin_users');
            if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                 // Ensure initial user exists if storage is manipulated or empty
                if (!parsedUsers.some((u: AdminUser) => u.email === initialUsers[0].email)) {
                    const updatedUsers = [...parsedUsers, ...initialUsers];
                    localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
                    setUsers(updatedUsers);
                } else {
                    setUsers(parsedUsers);
                }
            } else {
                localStorage.setItem('admin_users', JSON.stringify(initialUsers));
                setUsers(initialUsers);
            }
        } catch (error) {
            // Silently fail if localStorage is not available or parsing fails
            localStorage.setItem('admin_users', JSON.stringify(initialUsers));
            setUsers(initialUsers);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = (email: string, pass: string): boolean => {
        const foundUser = users.find(u => u.email === email && u.password === pass);
        if (foundUser) {
            const userData: User = { email: foundUser.email, role: 'admin' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const addUser = (newUser: AdminUser) => {
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
    };

    const removeUser = (email: string) => {
        const updatedUsers = users.filter(u => u.email !== email);
        setUsers(updatedUsers);
        localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
    };
    
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, users, loading, login, logout, addUser, removeUser }}>
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
