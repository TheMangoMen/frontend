"use client"

import { Logo } from "./logo";
import { ModeToggle } from "./ui/mode-toggle";
import { User } from "./user-button.tsx/user-button";

export function Header() {
    return <header className="sticky top-0 bg-background z-10 shadow dark:shadow-gray-700">
        <div className="flex items-center justify-between h-20 select-none max-w-6xl mx-auto px-8">
            <Logo />
            <div className="flex gap-5 items-center">
                <div className="justify-end"><ModeToggle /></div>
                <User /> {/* it's dinner time */}
            </div>
        </div>
    </header>
}