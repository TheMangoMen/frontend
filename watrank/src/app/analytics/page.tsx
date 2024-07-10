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
import { notFound } from "next/navigation";

interface WatchedStatusCount {
    Status: string;
    Count: number;
}

interface AnalyticsData {
    jobs: WatchedStatusCount[];
    companies: WatchedStatusCount[];
}

const chartConfig = {
    total: {
        label: "Total",
    },
    oa: {
        label: "OA",
        color: "hsl(var(--chart-oa))",
    },
    interview: {
        label: "Interview",
        color: "hsl(var(--chart-interview))",
    },
    offercall: {
        label: "Offer Call",
        color: "hsl(var(--primary))",
    },
    nothing: {
        label: "Nothing",
        color: "hsl(var(--chart-nothing))",
    }
} satisfies ChartConfig

const addColors = (arr: WatchedStatusCount[]) => arr.map((cat: any) => ({ fill: `var(--color-${cat.Status.toLowerCase().replace(/\s+/g, '')})`, ...cat }));

export default function AnalyticsPage() {
    const { token, authIsLoading } = useAuth()
    const { toast } = useToast()
    const [jobData, setJobData] = useState<WatchedStatusCount[]>([])
    const [companyData, setCompanyData] = useState<WatchedStatusCount[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn } = useAuth()

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
            const json: AnalyticsData = await response.json();
            setJobData(addColors(json.jobs))
            setCompanyData(addColors(json.companies))
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
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

    if (!isLoggedIn()) {
        notFound();
    };

    return (
        <div className="px-10">
            <div className="flex flex-wrap lg:flex-nowrap justify-between gap-2">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Jobs</CardTitle>
                        <CardDescription>Status of jobs in your watchlist</CardDescription>
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
                    {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Total Jobs Watched: {total_jobs_watched}
                        </div>
                    </CardFooter> */}
                </Card>
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle>Companies</CardTitle>
                        <CardDescription>Status of companies in your watchlist</CardDescription>
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
