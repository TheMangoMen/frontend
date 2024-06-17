"use client"

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import { User } from "./user-button.tsx/user-button";

export function Header() {
    return <header className="bg-background transition flex items-center justify-between px-6 md:px-10 py-10 sticky h-[60px] left-0 right-0 top-0 z-10 select-none">
        <Logo />
        <div className="flex gap-5 items-center">
            <User /> {/* it's dinner time */}
            <div className="justify-end"><ModeToggle /></div>
        </div>
    </header>
}