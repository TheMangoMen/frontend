"use client";

import { useEffect, useState } from "react";
import { columns } from "./jobs/columns";
import { JobTable } from "./jobs/job-table";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "./login/components/icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import JobIDExtractor from "@/components/job-id-extractor";

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

export default function JobPage() {
    const { token, authIsLoading } = useAuth();
    const { toast } = useToast();
    const [data, setData] = useState([]);
    const [isRankingStage, setIsRankingStage] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    const showErrorToast = () =>
        toast({
            variant: "destructive",
            title: "An error occured fetching jobs",
            description: "Please try again later.",
        });

    const fetchJobs = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/jobs`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { ...(!!token && { Authorization: `Bearer ${token}` }) },
            });
            if (!response.ok) {
                showErrorToast();
            }
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    };

    const fetchState = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/stage`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { ...(!!token && { Authorization: `Bearer ${token}` }) },
            });
            if (!response.ok) {
                showErrorToast();
            }
            const json = await response.json();
            setIsRankingStage(json);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            showErrorToast();
        }

    }

    useEffect(() => {
        if (!authIsLoading) {
            fetchJobs();
            fetchState();
        }
    }, [authIsLoading]);

    if (isLoading) {
        return (
            <Icons.spinner className="m-auto h-12 w-12 animate-spin stroke-primary" />
        );
    }

    return (
        <JobTable
            columns={columns}
            data={data}
            setData={setData}
            refresh={fetchJobs}
        />
    );
}
