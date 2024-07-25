"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type GlobalContextType = {
    isRankingStage: string | undefined;
    globalIsLoading: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isRankingStage, setIsRankingStage] = useState<string>();
    const [globalIsLoading, setGlobalIsLoading] = useState<boolean>(true);
    useEffect(() => {
        setGlobalIsLoading(true);
        const fetchStage = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/stage`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                });
                const json = await response.json();
                setIsRankingStage(json);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStage();
        setGlobalIsLoading(false);
    }, [])

    return (
        <GlobalContext.Provider value={{ isRankingStage, globalIsLoading }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobal = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error("");
    }
    return context;
}
