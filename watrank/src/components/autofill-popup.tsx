"use client";

import { User } from "./user-button.tsx/user-button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import JobIDExtractor from "@/components/job-id-extractor";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface CommandKeyProps {
    text: string;
}

const CommandKey: React.FC<CommandKeyProps> = ({ text }) => {
    const [commandKey, setCommandKey] = useState("");

    useEffect(() => {
        const isMac = navigator.userAgent.includes("Mac");
        setCommandKey(isMac ? "⌘ " : "Ctrl+");
    }, []);

    return (
        <span className="bg-muted p-1 rounded-md shadow-md">
            <code className="font-mono text-sm">
                {commandKey}
                {text}
            </code>
        </span>
    );
};

interface AutofillPopupContentProps {
    children?: React.ReactNode;
    refresh?: () => void;
}

function AutofillPopupContent({
    children,
    refresh,
}: AutofillPopupContentProps) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Import jobs</DialogTitle>
            </DialogHeader>
            <ul className="list-decimal pl-6 leading-loose">
                <li>
                    Go to your applications table on{" "}
                    <a
                        href="https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/applications.htm"
                        target="_blank"
                        className="underline"
                    >
                        WaterlooWorks
                    </a>
                </li>
                <li>
                    Select all using <CommandKey text="A" /> then copy with{" "}
                    <CommandKey text="C" />
                </li>
                <li>Click the button below!</li>
            </ul>
            <JobIDExtractor refresh={refresh} />
            {children}
        </DialogContent>
    );
}

export function AutofillPopup() {
    return (
        <Dialog>
            <AutofillPopupContent>
                <User />
            </AutofillPopupContent>
        </Dialog>
    );
}

export function AutofillPopupWithoutButton({
    refresh,
}: {
    refresh?: () => void;
}) {
    return (
        <Dialog>
            <AutofillPopupContent refresh={refresh} />
            <DialogTrigger>
                <Button variant={"outline"}>Import Jobs</Button>
            </DialogTrigger>
        </Dialog>
    );
}
