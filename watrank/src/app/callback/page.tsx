"use client";

import { useAuth } from "@/context/AuthContext";
import { capture } from "@/lib/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Icons } from "../login/components/icons";
import { Button } from "@/components/ui/button";

const Message = ({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className="w-full h-full flex justify-center items-center mb-[80px]">
            <div className="flex flex-col text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">{description}</p>
                {children}
            </div>
        </div>
    );
};

function CallbackHelper() {
    const { login, token, authIsLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Exchange the code once per page load.
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
                capture("login_completed");
                setIsValid(true);
                router.push("/jobs");
            } catch {
                capture("login_failed");
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };
        exchange();
    }, []);

    // The link was already used, but this browser is logged in (e.g. the link
    // was clicked twice): there's nothing to fix, so carry on to jobs.
    const alreadyLoggedIn = !isLoading && !isValid && token !== null;
    useEffect(() => {
        if (alreadyLoggedIn) router.replace("/jobs");
    }, [alreadyLoggedIn, router]);

    if (isLoading || alreadyLoggedIn || (!isValid && authIsLoading)) {
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
            description="This login link is invalid, expired, or already used. Login links expire after 15 minutes."
        >
            <div className="pt-4">
                <Button asChild>
                    <Link href="/login">Send a new link</Link>
                </Button>
            </div>
        </Message>
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
