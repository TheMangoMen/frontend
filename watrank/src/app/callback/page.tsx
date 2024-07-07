"use client"

import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation'

import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react';
import { Icons } from '../login/components/icons';

const Message = ({ title, description }: { title: string, description: string }) => {
    return <div className="w-full h-full flex justify-center items-center mb-[80px]">
        <div className="flex flex-col text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
                {title}
            </h1>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
}

function CallbackHelper() {
    const { login } = useAuth();
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const code = searchParams?.get("code")

        if (code) {
            try {
                const token = atob(code);
                jwtDecode(token).sub

                login(token)
                setIsValid(true);
                router.push('/')
            } catch {
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        }
    }, [])

    if (isLoading) {
        return
    }

    if (isValid) {
        return <Message title='Success!' description='Redirecting you to jobs...' />
    }

    return <Message title='Error :(' description='Please double check that your link is valid' />;
}

export default function Callback() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <CallbackHelper />
        </Suspense>
    )
}
