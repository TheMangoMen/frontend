import { cn } from "@/lib/utils";
import React from "react";

function CountCell({
    value,
    className,
}: {
    value: number;
    className?: string;
}) {
    let styles =
        "w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center font-bold text-dark-grey mx-auto";
    if (value > 0) {
        styles = cn(styles, className);
    }
    return (
        <div className={styles}>
            <span>{value}</span>
        </div>
    );
}

export const cellStyles = {
    OA: {
        text: "text-dark-yellow dark:text-yellow-200",
        bg: "bg-yellow-400/30",
    },
    interview: {
        text: "text-dark-green dark:text-green-200",
        bg: "bg-green-400/30",
    },
    offer: {
        text: "text-dark-blue dark:text-blue-200",
        bg: "bg-blue-400/30",
    },
    notTaking: {
        text: "text-dark-red dark:text-red-200",
        bg: "bg-red-400/30",
    },
};

export function OACountCell({ value }: { value: number }) {
    return (
        <CountCell value={value} className={cn(Object.values(cellStyles.OA))} />
    );
}

export function InterviewCountCell({ value }: { value: number }) {
    return (
        <CountCell
            value={value}
            className={cn(Object.values(cellStyles.interview))}
        />
    );
}

export function OfferCountCell({ value }: { value: number }) {
    return (
        <CountCell
            value={value}
            className={cn(Object.values(cellStyles.offer))}
        />
    );
}

export function NotTakingCountCell({ value }: { value: number }) {
    return (
        <CountCell
            value={value}
            className={cn(Object.values(cellStyles.notTaking))}
        />
    );
}
