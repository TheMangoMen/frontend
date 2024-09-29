"use client";
import { Job } from "./job";
import CountCell, { InterviewCountCell, OACountCell, OfferCountCell } from "./table-v2/count-cell";
import { Tags } from "./tags";
import { ColumnDef, Row, Table, useReactTable } from "@tanstack/react-table";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Stepper from "@/components/ui/stepper";
import { Status } from "./status";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Contribute from "./contribute";
import JobCell from "./table-v2/job-cell";

function Watching({ row, table }: { row: Row<Job>; table: Table<Job> }) {
    const { token, isLoggedIn, authIsLoading } = useAuth();
    const { toast } = useToast();
    const [watching, setWatching] = React.useState(false);

    const showErrorToast = () =>
        toast({
            variant: "destructive",
            title: "An error occurred while trying to update your watchlist.",
        });

    async function toggleWatch(isWatching: boolean) {
        const data = {
            jids: [row.getValue("jid")],
            delete: isWatching,
        };

        // Update table data state (so column filters are updated)
        table.options.meta?.updateData(row.index, "watching", !isWatching);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/watching`,
                {
                    method: "POST",
                    headers: {
                        ...(!!token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                showErrorToast();
                table.options.meta?.updateData(row.index, "watching", isWatching); // reset
            } else {
                setWatching(!watching);
                toast({ title: "Updated your watch list!" });
            }
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    // Use useEffect to set the initial state
    React.useEffect(() => {
        setWatching(row.getValue("watching") ?? false);
    }, [row]);

    return (
        <div className="h-full w-full flex justify-center">
            <Tooltip>
                <TooltipContent>
                    <p>
                        {isLoggedIn()
                            ? "Update your watch list"
                            : "Log in to start a watch list"}
                    </p>
                </TooltipContent>
                <TooltipTrigger>
                    <Button
                        disabled={!isLoggedIn()}
                        onClick={() => toggleWatch(watching)}
                        key={row.id}
                        className={`text-primary ${!watching && "text-transparent"
                            } disabled:text-foreground/50 hover:text-primary h-full flex p-1`}
                        variant="ghost"
                    >
                        <StarFilledIcon />
                    </Button>
                </TooltipTrigger>
            </Tooltip>
        </div>
    );
}

export const columns: ColumnDef<Job>[] = [
    {
        accessorKey: "isOpen",
        header: "",
        enableHiding: false,
        meta: { className: "w-8 justify-center" }, // Fixed width and no flexing
    },
    {
        accessorKey: "OA",
        header: "OA",
        enableHiding: false,
        cell: ({ row, table }) => <OACountCell value={row.getValue("OA")} />,
        meta: { className: "w-14 justify-center" }, // Fixed width and no flexing
    },
    {
        accessorKey: "Interview",
        header: "Interview",
        enableHiding: false,
        cell: ({ row, table }) => <InterviewCountCell value={row.getValue("Interview")} />,
        meta: { className: "w-20 justify-center" },
    },
    {
        accessorKey: "Offer",
        header: "Offer",
        enableHiding: false,
        cell: ({ row, table }) => <OfferCountCell value={row.getValue("Offer")} />,
        meta: { className: "w-14 justify-center" },
    },
    {
        accessorKey: "job",
        header: "Job",
        enableHiding: false,
        cell: ({ row }) => (
            <JobCell
                title={row.original.title}
                company={row.original.company}
                jid={row.original.jid}
            />
        ),
        meta: { className: "flex-1 justify-start" },
        sortingFn: (rowA, rowB) => rowA.original.company.localeCompare(rowB.original.company)
    },
    {
        accessorKey: "",
        id: "contribute",
        header: "",
        cell: ({ row, table }) => {
            const refresh = table.options.meta?.refresh;
            return <Contribute row={row} refresh={refresh} />;
        },
        enableHiding: false,
        meta: { className: "w-12 flex-none" },
    },
    {
        accessorKey: "location",
        header: "Location",
        meta: { className: "w-32" },
    },
    {
        accessorKey: "openings",
        header: "Openings",
        meta: { className: "w-20" },
    },
    {
        accessorKey: "jid",
        header: "ID",
        meta: { className: "w-20" },
    },
];