"use client";

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "./user-button.tsx/user-button";

export function Header() {
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
