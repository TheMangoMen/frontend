"use client";
import { Job } from "./job";
import { InterviewCountCell, OACountCell, OfferCountCell } from "./table-v2/count-cell";
import { ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import Contribute from "./contribute";
import JobCell from "./table-v2/job-cell";
export const interviewColumns: ColumnDef<Job>[] = [
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