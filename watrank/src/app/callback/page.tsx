"use client"

import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react';

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

export default function Callback() {
    const { login } = useAuth();
    const searchParams = useSearchParams()
    const router = useRouter()
    const [content, setContent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        const code = searchParams?.get("code")

        if (code) {
            try {
                const token = atob(code);
                const user = jwtDecode(token).sub

                login(token)
                router.push('/jobs')
                setContent(() => <Message title='Success!' description='Redirecting you to jobs...' />)
            } catch {
                setContent(() => <Message title='Error :(' description='Please double check that your link is valid' />)
            }
        }
    }, [])

    return content;
}
