"use client"

import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';

export default function Callback() {
    const { login } = useAuth();
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const code = searchParams?.get("code")

        if (code) {
            try {
                const token = atob(code);
                const user = jwtDecode(token).sub

                login(token)
                router.push('/jobs')
            } catch { }
        }
    }, [])

    return "OOPs"
}
