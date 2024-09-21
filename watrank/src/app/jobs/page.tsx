"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { JobTable } from "./job-table";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "../login/components/icons";
import { useRouter } from "next/navigation";

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
    const { token, logout, authIsLoading } = useAuth();
    const { toast } = useToast();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const showErrorToast = () =>
        toast({
            variant: "destructive",
            title: "An error occured fetching jobs",
            description: "Please try again later.",
        });
    
        const showTokenExpiredToast = () =>
            toast({
                variant: "destructive",
                title: "Your session expired",
                description: "Please login again.",
            });

    const fetchJobs = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/jobs`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { ...(!!token && { Authorization: `Bearer ${token}` }) },
            });
            if(!response.ok){
                if (response.status === 401) {  
                    
                    logout();
                    showTokenExpiredToast(); 
                    router.push('/login')
                } else {
                   showTokenExpiredToast();
                }
            } else {
                const json = await response.json();
                setData(json);
                setIsLoading(false);
            }
            
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    };

    useEffect(() => {
        if (!authIsLoading) {
            fetchJobs();
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
