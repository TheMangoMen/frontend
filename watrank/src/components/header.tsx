"use client";

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FullStory, init } from "@fullstory/browser";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "./user-button.tsx/user-button";

export function Header() {
    const { token } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        init({ orgId: "o-22JNHK-na1" }, () => {
            setIsInitialized(true);
        });
        console.log("hello");
    }, []);

    useEffect(() => {
        if (token && isInitialized) {
            FullStory("setIdentity", {
                uid: jwtDecode(token).sub,
                properties: {
                    displayName: jwtDecode(token).sub,
                    email: jwtDecode(token).sub,
                },
            });
        }
        console.log("stuff", token, isInitialized);
    }, [token, isInitialized]);

    return (
        <header className="sticky top-0 bg-background z-50 shadow dark:shadow-gray-700">
            <div className="flex items-center justify-between h-[4.5rem] select-none max-w-6xl mx-auto px-6 md:px-8">
                <div className="flex items-center gap-1 md:gap-4">
                    <Logo />
                </div>
                <div className="flex gap-2 items-center">
                    <div className="justify-end">
                        <ModeToggle />
                    </div>
                    <User />
                </div>
            </div>
        </header>
    );
}
