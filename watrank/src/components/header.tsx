"use client"

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { useAuth } from '@/context/AuthContext';
import {
    Tooltip,
    TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import { AutofillPopup } from "./autofill-popup";

export function Header() {
    const { isLoggedIn } = useAuth();
    return <header className="sticky top-0 bg-background z-10 shadow dark:shadow-gray-700">
        <div className="flex items-center justify-between h-[4.5rem] select-none max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex items-center gap-1 md:gap-4">
                <Logo />
            </div>
            <div className="flex gap-2 items-center">
                <div className="hidden md:block justify-end"><ModeToggle /></div>
                <div className="hidden md:block">
                    {!isLoggedIn() && (
                        <Tooltip>
                            <TooltipTrigger className="cursor-not-allowed self-end">
                                <Button variant="outline" className="text-gray-400" disabled asChild>
                                    <div className="flex font-medium text-xs md:text-base gap-2 md:justify-start ">
                                        View Jobs
                                    </div>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Please log in to view jobs</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <AutofillPopup />
            </div>
        </div>
    </header>
}