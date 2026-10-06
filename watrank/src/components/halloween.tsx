"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { applySeasonalTheme } from "@/lib/seasonal";

// Decorations for the Halloween theme. Everything here is hidden unless <html>
// has the `halloween` class (see src/lib/seasonal.ts), so these can stay
// mounted year round.

export function Bat({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 44"
            className={className}
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M50 10 L46 3 L44 11 C38 9 33 6 28 0 C27 9 18 14 4 12 C11 18 13 26 9 34 C19 28 28 30 33 38 C38 31 44 30 50 34 C56 30 62 31 67 38 C72 30 81 28 91 34 C87 26 89 18 96 12 C82 14 73 9 72 0 C67 6 62 9 56 11 L54 3 Z" />
        </svg>
    );
}

export function Pumpkin({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
            <path
                d="M31 14 C30 8 33 4 38 3"
                stroke="#3f6212"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
            />
            <ellipse cx="20" cy="38" rx="14" ry="20" fill="#ea580c" />
            <ellipse cx="44" cy="38" rx="14" ry="20" fill="#ea580c" />
            <ellipse cx="32" cy="38" rx="13" ry="22" fill="#f97316" />
            <path d="M20 32 L26 32 L23 26 Z" fill="#1c0f05" />
            <path d="M38 32 L44 32 L41 26 Z" fill="#1c0f05" />
            <path
                d="M18 42 Q32 54 46 42 L42 44 L39 41 L35 45 L32 42 L29 45 L25 41 L22 44 Z"
                fill="#1c0f05"
            />
        </svg>
    );
}

// A cobweb anchored in the top-left corner; rotate it for other corners.
function Cobweb({ className }: { className?: string }) {
    const size = 160;
    const spokes = [0, 18, 36, 54, 72, 90].map((deg) => (deg * Math.PI) / 180);
    const rings = [30, 58, 88, 120, 150];
    const point = (r: number, a: number) =>
        `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
        >
            {spokes.map((a, i) => (
                <path key={`s${i}`} d={`M0 0 L${point(size * 1.05, a)}`} />
            ))}
            {rings.map((r, i) => (
                <path
                    key={`r${i}`}
                    d={spokes
                        .slice(1)
                        .map((a, j) => {
                            const prev = spokes[j];
                            const mid = (prev + a) / 2;
                            return `${j === 0 ? `M${point(r, prev)} ` : ""}Q${point(r * 0.82, mid)} ${point(r, a)}`;
                        })
                        .join(" ")}
                />
            ))}
        </svg>
    );
}

function Spider({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex flex-col items-center motion-safe:animate-spider-dangle",
                className
            )}
        >
            <div className="w-px h-24 bg-foreground/40" />
            <svg
                viewBox="0 0 40 32"
                className="w-7 h-6 text-foreground/80"
                aria-hidden="true"
            >
                <g stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M14 14 L4 6 L0 10" />
                    <path d="M14 17 L2 16 L0 20" />
                    <path d="M14 19 L4 26 L2 31" />
                    <path d="M26 14 L36 6 L40 10" />
                    <path d="M26 17 L38 16 L40 20" />
                    <path d="M26 19 L36 26 L38 31" />
                </g>
                <circle cx="20" cy="18" r="8" fill="currentColor" />
                <circle cx="20" cy="9" r="5" fill="currentColor" />
                <circle cx="18" cy="8" r="1.2" fill="#f97316" />
                <circle cx="22" cy="8" r="1.2" fill="#f97316" />
            </svg>
        </div>
    );
}

const bats = [
    { top: "12%", delay: "0s", duration: "22s", size: "w-14" },
    { top: "24%", delay: "-8s", duration: "28s", size: "w-10" },
    { top: "7%", delay: "-15s", duration: "34s", size: "w-8" },
];

export function HalloweenDecorations() {
    // The inline script in layout.tsx sets the class before paint, but React
    // can rebuild <html> while hydrating, so set it again once mounted.
    useEffect(applySeasonalTheme, []);

    return (
        <div
            className="hidden halloween:block pointer-events-none fixed inset-0 z-[60] overflow-hidden select-none"
            aria-hidden="true"
        >
            <Cobweb className="absolute top-0 left-0 w-28 md:w-40 text-foreground/15" />
            <Cobweb className="absolute top-0 right-0 w-24 md:w-36 text-foreground/15 -scale-x-100" />
            <Spider className="absolute top-0 right-4 md:right-6" />
            {bats.map((bat, i) => (
                <div
                    key={i}
                    className="absolute left-0 motion-safe:animate-bat-fly motion-reduce:hidden"
                    style={{
                        top: bat.top,
                        animationDelay: bat.delay,
                        animationDuration: bat.duration,
                    }}
                >
                    <Bat
                        className={cn(
                            bat.size,
                            "text-purple-950/70 dark:text-purple-300/60 motion-safe:animate-bat-flap"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}

export function HalloweenBanner() {
    return (
        <div className="hidden halloween:inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 mb-6 shadow-sm">
            <Pumpkin className="w-6 h-6 motion-safe:animate-flicker" />
            <span className="text-sm lg:text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-400 dark:to-purple-400">
                Happy Halloween! Spooky season, scary interviews.
            </span>
        </div>
    );
}
