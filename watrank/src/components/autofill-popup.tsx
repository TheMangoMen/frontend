"use client"

import { User } from "./user-button.tsx/user-button";
import {
    Dialog,
    DialogContent, DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import JobIDExtractor from "@/components/job-id-extractor";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

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

export function AutofillPopup() {
    return <Dialog>
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
}

export function AutofillPopupWithoutButton() {
    return <Dialog>
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
            <JobIDExtractor/>
        </DialogContent>
        <DialogTrigger> <Button variant={"outline"}>Import Jobs</Button></DialogTrigger>
    </Dialog>
}