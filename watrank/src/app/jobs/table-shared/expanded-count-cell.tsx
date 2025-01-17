import React from "react";
import { cellStyles } from "./count-cell";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Check = ({ className }: { className?: string }) => (
    <CheckIcon className={`w-5 h-5 ${className}`} />
);

export function OACheck() {
    return <Check className={cellStyles.OA.text} />;
}

export function InterviewRound({ round }: { round: number }) {
    return <div className="text-dark-green dark:text-green-200">#{round}</div>;
}

export function EmployerRanking({ rank }: { rank: string }) {
    switch (rank) {
        case "Ranked":
            return <div className="text-secondary-foreground">{rank}</div>;
        case "Offer":
            return (
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold">
                    {rank}
                </div>
            );
    }
}

export function UserRanking({ rank }: { rank: number }) {
    console.log(rank);
    switch (rank) {
        case -1:
            return (
                <div className="text-xs text-center text-red-700 dark:text-red-200 leading-3">
                    {"Not Interested"}
                </div>
            );
        case 1:
            return (
                <div
                    className={
                        "font-bold text-center text-dark-green dark:text-green-200 ordinal"
                    }
                >
                    {rank}
                </div>
            );
        default:
            return (
                <div className={cn(cellStyles.OA.text, "text-center")}>
                    {rank}
                </div>
            );
    }
}

export function OfferCheck() {
    return <Check className={cellStyles.offer.text} />;
}
