"use client"

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import { User } from "./user-button.tsx/user-button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import JobIDExtractor from "@/components/job-id-extractor";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

interface CommandKeyProps {
    text: string;
}

const CommandKey: React.FC<CommandKeyProps> = ({ text }) => {
    const [commandKey, setCommandKey] = useState('');

    useEffect(() => {
        const isMac = navigator.userAgent.includes('Mac');
        setCommandKey(isMac ? '⌘ ' : 'Ctrl+');
    }, []);

    return (
        <span className="bg-muted p-1 rounded-md shadow-md">
            <code className="font-mono text-sm">{commandKey}{text}</code>
        </span>
    );
};

export function Header() {
    return <header className="sticky top-0 bg-background z-10 shadow dark:shadow-gray-700">
        <div className="flex items-center justify-between h-[4.5rem] select-none max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex items-center gap-1 md:gap-4">
            <Logo />
            </div>
            <div className="flex md:gap-5 items-center">
                <div className="hidden md:block">
                    <Link href="/jobs" className={buttonVariants({ variant: "outline" })}>
                        <div className="flex font-medium text-xs md:text-base gap-2 md:justify-start ">
                        View Jobs
                        </div>
                    </Link>
                </div>   
                <Dialog>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Autofill watchlist</DialogTitle>
                        </DialogHeader>
                        <ul className="list-decimal pl-6 leading-loose">
                            <li>
                                Go to your applications table on <a href="https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/applications.htm" target="_blank" className="underline">WaterlooWorks</a>
                            </li>
                            <li>
                                Select all using <CommandKey text="A" /> then copy with <CommandKey text="C" />
                            </li>
                            <li>
                                Cick the button below!
                            </li>
                        </ul>
                        <JobIDExtractor />
                    </DialogContent>
                    <User />
                </Dialog>
                <div className="hidden md:block justify-end"><ModeToggle /></div>
            </div>
        </div>
    </header>
}