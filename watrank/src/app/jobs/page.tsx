"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { JobTable } from "./job-table";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "../login/components/icons";
import { useRouter } from "next/navigation";
import SortableTable from "./table-v2/sample";
import { stageCountFn } from "@/utils/utils";

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

// {
//     "archived": false,
//     "jid": 382693,
//     "title": "Analytics Engineering",
//     "company": "Faire",
//     "location": "Waterloo",
//     "openings": 1,
//     "stages": [
//         {
//             "name": "OA",
//             "count": 0
//         },
//         {
//             "name": "Interview 1",
//             "count": 1
//         },
//         {
//             "name": "Interview 2",
//             "count": 0
//         },
//         {
//             "name": "Interview 3",
//             "count": 0
//         },
//         {
//             "name": "Offer Call",
//             "count": 0
//         }
//     ],
//     "tags": {
//         "oadifficulty": "",
//         "oalength": "",
//         "interviewvibe": "",
//         "interviewtechnical": "",
//         "compensation": 0
//     },
//     "inprogress": true
// }

function parseJson(json: any) {
    const stageCount = stageCountFn(json.stages);

    return {
        ...json,
        OA: stageCount("OA")?.count,
        Interview: stageCount("Interview 1")?.count,
        Offer: stageCount("Offer Call")?.count,
    };
}


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
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {

                    logout();
                    showTokenExpiredToast();
                    router.replace('/login')
                } else {
                    showErrorToast();
                }
            } else {
                const json = await response.json();
                const data = json.map(parseJson);
                setData(data);
                console.log("stuff", data);
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
            fetchJobs={fetchJobs}
        />
    );
}
