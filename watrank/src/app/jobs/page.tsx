"use client";

import { useEffect, useState } from "react";
import { interviewColumns } from "./interview/interview-columns";
import { InterviewTable } from "./interview/interview-table";
import { RankingTable } from "./ranking/ranking-table";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "../login/components/icons";
import { useRouter } from "next/navigation";
import { stageCountFn } from "@/utils/utils";
import { rankingColumns } from "./ranking/ranking-columns";

function parseJson(json: any) {
    const stageCount = stageCountFn(json.stages);

    return {
        ...json,
        OA: stageCount("OA")?.count,
        Interview: stageCount("Interview 1")?.count,
        Offer: stageCount("Offer Call")?.count,
        Ranked: stageCount("Ranked")?.count,
        Taking: stageCount("Taking")?.count,
        NotTaking: stageCount("Not Taking")?.count
    };
}

export default function JobPage() {
    const { token, logout, authIsLoading } = useAuth();
    const { toast } = useToast();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRankingTable, setShowRankingTable] = useState(false);
    const router = useRouter();

    const showErrorToast = (message: string) =>
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: message,
        });

    const showTokenExpiredToast = () =>
        toast({
            variant: "destructive",
            title: "Your session expired",
            description: "Please login again.",
        });

    const fetchStageAndJobs = async () => {
        setIsLoading(true);
        try {
            const [stageResponse, jobsResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/stage`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            if (!stageResponse.ok || !jobsResponse.ok) {
                if (stageResponse.status === 401 || jobsResponse.status === 401 ||
                    stageResponse.status === 403 || jobsResponse.status === 403) {
                    logout();
                    showTokenExpiredToast();
                    router.replace('/login');
                    return;
                }
                throw new Error("Failed to fetch data");
            }

            const [stageValue, jobsJson] = await Promise.all([
                stageResponse.json(),
                jobsResponse.json()
            ]);
            console.log(stageValue === true)
            setShowRankingTable(stageValue);
            const parsedData = jobsJson.map(parseJson);
            setData(parsedData);
        } catch (error) {
            console.error("Error:", error);
            showErrorToast(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authIsLoading && token) {
            fetchStageAndJobs();
        }
    }, [authIsLoading, token, showRankingTable]);

    if (isLoading) {
        return (
            <Icons.spinner className="m-auto h-12 w-12 animate-spin stroke-primary" />
        );
    }

    return (
        <>
            {showRankingTable ? (
                <RankingTable
                    columns={rankingColumns}
                    data={data}
                    setData={setData}
                    fetchJobs={fetchStageAndJobs}
                />
            ) : (
                <InterviewTable
                    columns={interviewColumns}
                    data={data}
                    setData={setData}
                    fetchJobs={fetchStageAndJobs}
                />
            )}
        </>
    );
}