"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const { toast } = useToast();

    const showLogoutToast = () => {
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                setToken(token);
            } catch (error) {
                console.error("Invalid token");
                Cookies.remove('token');
            }
        }
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token);
        setToken(token);
        toast({ title: "Log in successful!", });
    };

    const logout = () => {
        Cookies.remove('token');
        setToken(null);
        toast({ title: "Log out successful!", });
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
