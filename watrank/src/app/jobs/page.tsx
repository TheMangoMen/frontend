"use client"

import { useEffect, useState } from "react";
import { columns } from "./columns"
import { Job } from "./job"
import { JobTable } from "./job-table"
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "../login/components/icons";

export default function JobPage() {
    const { token, authIsLoading } = useAuth()
    const { toast } = useToast()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const showErrorToast = () => toast({
        variant: "destructive",
        title: "An error occured fetching jobs",
        description: "Please try again later."
    });

    const fetchJobs = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/jobs`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                showErrorToast();
            }
            const json = await response.json()
            setData(json)
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    useEffect(() => {
        if (!authIsLoading) {
            fetchJobs()
        }
    }, [authIsLoading])

    if (isLoading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Icons.spinner className="h-12 w-12 animate-spin" />
        </div>
    }

    return (
        <div className="px-10">
            <JobTable columns={columns} data={data} />
        </div>
    )

}
