'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: AdminUser[] = [
    { email: 'admin@cficiras.com', password: 'password', role: 'admin' },
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
                setUsers(JSON.parse(storedUsers));
            } else {
                localStorage.setItem('admin_users', JSON.stringify(initialUsers));
                setUsers(initialUsers);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('admin_users');
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

    return (
        <AuthContext.Provider value={{ user, users, loading, login, logout, addUser }}>
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
