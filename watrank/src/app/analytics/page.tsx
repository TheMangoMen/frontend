"use client"

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "../login/components/icons";
import { Pie, PieChart, Cell, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface WatchedStatusCount {
    Status: string;
    Count: number;
}

interface AnalyticsData {
    jobs: WatchedStatusCount[];
    companies: WatchedStatusCount[];
}

export default function AnalyticsPage() {
    const { token, authIsLoading } = useAuth()
    const { toast } = useToast()
    const [jobData, setJobData] = useState<WatchedStatusCount[]>([])
    const [companyData, setCompanyData] = useState<WatchedStatusCount[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const chartConfig = {
        total: {
            label: "Total"
        },
        oa: {
            label: "OA"
        },
        interview: {
            label: "Interview"
        },
        offercall: {
            label: "Offer Call"
        },
        nothing: {
            label: "Nothing"
        }
    } satisfies ChartConfig

    const total_jobs_watched = useMemo(() => {
        return jobData.reduce((acc, cur) => acc + cur.Count, 0)
    }, [jobData])

    const showErrorToast = () => toast({
        variant: "destructive",
        title: "An error occured fetching analytics",
        description: "Please try again later."
    });

    const fetchStatus = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/analytics/status_counts`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { ...(!!token && { 'Authorization': `Bearer ${token}` }) }
            });
            if (!response.ok) {

                showErrorToast();
            }
            const json: AnalyticsData = await response.json();
            setJobData(json.jobs)
            setCompanyData(json.companies)
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    useEffect(() => {
        if (!authIsLoading) {
            fetchStatus()
        }
    }, [authIsLoading])

    if (isLoading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Icons.spinner className="h-12 w-12 animate-spin" />
        </div>
    }

    return (
        <div className="px-10">
            <div className="flex flex-wrap lg:flex-nowrap justify-between gap-2">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Watched Jobs Status</CardTitle>
                        <CardDescription>Check what jobs you applied to are at what stages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                accessibilityLayer
                                data={jobData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <XAxis type="number" dataKey="Count" interval={0} tickFormatter={(value) => Number.isInteger(value) ? value : ''} />
                                <YAxis
                                    dataKey="Status"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="Count" fill="var(--color-bar)" radius={5} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Total Jobs Watched: {total_jobs_watched}
                        </div>
                    </CardFooter>
                </Card>
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Watched Companies Status</CardTitle>
                        <CardDescription>Check what companies you applied to are at what stages for all their jobs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                accessibilityLayer
                                data={companyData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <XAxis type="number" dataKey="Count" interval={0} tickFormatter={(value) => Number.isInteger(value) ? value : ''} />
                                <YAxis
                                    dataKey="Status"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="Count" fill="var(--color-bar)" radius={5} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
