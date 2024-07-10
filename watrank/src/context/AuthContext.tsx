"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    authIsLoading: boolean;
    isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ExtendedJwtPayload extends JwtPayload {
    admin: boolean;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    useEffect(() => {
        setAuthIsLoading(true)
        const token = Cookies.get('token');
        if (token) {
            try {
                setToken(token);
            } catch (error) {
                console.error("Invalid token");
                Cookies.remove('token');
            }
        }
        setAuthIsLoading(false)
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

    const isLoggedIn = () => token !== null;

    const isAdmin = () => token !== null && jwtDecode<ExtendedJwtPayload>(token)?.admin

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoggedIn, authIsLoading, isAdmin }}>
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
