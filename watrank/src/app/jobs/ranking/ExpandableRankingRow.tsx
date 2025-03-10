import React from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
    EmployerRanking,
    UserRanking,
} from "../table-shared/expanded-count-cell";
import { Tags } from "../table-shared/tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cellStyles } from "../table-shared/count-cell";

interface ExpandableRankingRowProps<TData> {
    row: Row<TData>;
    className?: string;
}

interface Contribution {
    userranking: number;
    employerranking: "Ranked" | "Offer";
}

const ExpandableRankingRow = ({
    row,
    className = "",
}: ExpandableRankingRowProps<any>) => {
    const { toast } = useToast();
    const { token, isLoggedIn } = useAuth();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [contributionData, setContributionData] = useState([]);

    const disabled = ["Ranked", "Taking", "NotTaking"]
        .map((s: any) => row.original[s])
        .every((i) => i === 0);

    // Simulated API cal
    const fetchExpandedData = async (id: string) => {
        try {
            const response = await fetch(
                `${
                    process.env.NEXT_PUBLIC_API_URL
                }/jobs/specific/ranking/${row.getValue("jid")}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();

                const sortedData = data.sort(
                    (a: Contribution, b: Contribution) => {
                        const employerRankingToNum = {
                            Ranked: 1,
                            Offer: 0,
                        };

                        const userrRankingToNum = (x: number) =>
                            x === -1 ? 99 : x;

                        const employerDiff =
                            employerRankingToNum[a.employerranking] -
                            employerRankingToNum[b.employerranking];
                        if (employerDiff !== 0) {
                            return employerDiff;
                        }

                        return (
                            userrRankingToNum(a.userranking) -
                            userrRankingToNum(b.userranking)
                        );
                    }
                );
                setContributionData(sortedData);
                console.log("contributt", data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch data.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Failed to fetch data." });
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["expandedData", row.id],
        queryFn: () => fetchExpandedData(row.id as string),
        enabled: isExpanded,
    });

    return (
        <>
            <TableRow
                key={row.id}
                className={cn(
                    `flex cursor-pointer hover:bg-secondary ${
                        isExpanded ? "bg-secondary" : ""
                    }`,
                    className
                )}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => !disabled && setIsExpanded(!isExpanded)}
            >
                {row.getVisibleCells().map((cell: any) => (
                    <TableCell
                        key={cell.id}
                        className={`flex items-center grow-0 shrink-0 ${cell.column.columnDef.meta?.className}`}
                    >
                        {cell.column.id === "isOpen" && !disabled ? (
                            <div className="ml-2 w-4 h-4 flex items-center text-secondary-foreground">
                                {isExpanded ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}
                            </div>
                        ) : (
                            flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )
                        )}
                    </TableCell>
                ))}
            </TableRow>
            {isExpanded && (
                <TableRow className="flex bg-secondary/80 hover:bg-secondary/80 border-b-muted-foreground/20">
                    {row.getVisibleCells().map((cell: any) => {
                        const DefaultCell = ({
                            children,
                        }: {
                            children?: React.ReactNode[] | React.ReactNode;
                        }) => (
                            <TableCell
                                key={cell.id}
                                className={`flex items-center grow-0 shrink-0 font-bold ${cell.column.columnDef.meta?.className}`}
                            >
                                {children}
                            </TableCell>
                        );

                        let render;
                        switch (cell.column.id) {
                            case "isOpen":
                                render = <DefaultCell />;
                                break;
                            case "Ranked":
                                render = (
                                    <DefaultCell>{"Employer"}</DefaultCell>
                                );
                                break;
                            case "NotTaking":
                                render = <DefaultCell>{"User"}</DefaultCell>;
                                break;
                        }
                        return render;
                    })}
                </TableRow>
            )}

            {isExpanded &&
                contributionData.map(
                    (contribution: Contribution, index: number) => {
                        const { employerranking, userranking } = contribution;

                        return (
                            <TableRow
                                key={index}
                                className="flex bg-secondary hover:bg-secondary"
                            >
                                {row.getVisibleCells().map((cell: any) => {
                                    const DefaultCell = ({
                                        children,
                                    }: {
                                        children?:
                                            | React.ReactNode[]
                                            | React.ReactNode;
                                    }) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`flex items-center grow-0 shrink-0 ${cell.column.columnDef.meta?.className}`}
                                        >
                                            {children}
                                        </TableCell>
                                    );

                                    let render;
                                    switch (cell.column.id) {
                                        case "isOpen":
                                            render = <DefaultCell />;
                                            break;
                                        case "Ranked":
                                            render = (
                                                <DefaultCell>
                                                    <EmployerRanking
                                                        rank={employerranking}
                                                    />
                                                </DefaultCell>
                                            );
                                            break;
                                        case "NotTaking":
                                            render = (
                                                <DefaultCell>
                                                    <UserRanking
                                                        rank={userranking}
                                                    />
                                                </DefaultCell>
                                            );
                                            break;
                                    }
                                    return render;
                                })}
                            </TableRow>
                        );
                    }
                )}
        </>
    );
};

export default ExpandableRankingRow;
