"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Icons } from "../login/components/icons";

const Message = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    return (
        <div className="w-full h-full flex justify-center items-center mb-[80px]">
            <div className="flex flex-col text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};

function CallbackHelper() {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // The login code works only once, so never send it twice.
    const exchanged = useRef(false);

    useEffect(() => {
        const code = searchParams?.get("code");
        if (!code) {
            setIsLoading(false);
            return;
        }
        if (exchanged.current) return;
        exchanged.current = true;

        const exchange = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/exchange`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                    }
                );
                if (!res.ok) throw new Error(`exchange failed: ${res.status}`);
                const { token } = await res.json();

                login(token);
                setIsValid(true);
                router.push("/jobs");
            } catch {
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };
        exchange();
    }, []);

    if (isLoading) {
        return;
    }

    if (isValid) {
        return (
            <Message
                title="Success!"
                description="Redirecting you to jobs..."
            />
        );
    }

    return (
        <Message
            title="Error :("
            description="This login link is invalid, expired, or already used. Please request a new one."
        />
    );
}

export default function Callback() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <CallbackHelper />
        </Suspense>
    );
}
