import React from "react";
import { cellStyles } from "./count-cell";
import { CheckIcon } from "lucide-react";

const Check = ({ className }: { className?: string }) => (
    <CheckIcon className={`w-5 h-5 ${className}`} />
);

export function OACheck() {
    return <Check className={cellStyles.OA.text} />
}

export function InterviewRound({ round }: { round: number }) {
    return <div className="text-dark-green dark:text-green-200">
        #{round}
    </div>
}

export function OfferCheck() {
    return <Check className={cellStyles.offer.text} />
}