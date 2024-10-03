"use client";
import { Job } from "../table-shared/job";
import { InterviewCountCell, NotTakingCountCell, OACountCell, OfferCountCell } from "../table-shared/count-cell";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Contribute from "../table-shared/contribute";
import JobCell from "../table-shared/job-cell";

export const rankingColumns: ColumnDef<Job>[] = [
    {
        accessorKey: "isOpen",
        header: "",
        enableHiding: false,
        meta: { className: "w-8 justify-center" }, // Fixed width and no flexing
    },
    {
        accessorKey: "Ranked",
        header: "Ranked",
        enableHiding: false,
        cell: ({ row, table }) => <OACountCell value={row.getValue("Ranked")} />,
        meta: { className: "w-16 justify-center" }, // Fixed width and no flexing
    },
    {
        accessorKey: "NotTaking",
        header: "Not Taking",
        enableHiding: false,
        cell: ({ row, table }) => <NotTakingCountCell value={row.getValue("NotTaking")} />,
        meta: { className: "w-24 justify-center" },
    },
    {
        accessorKey: "Taking",
        header: "Taking",
        enableHiding: false,
        cell: ({ row, table }) => <InterviewCountCell value={row.getValue("Taking")} />,
        meta: { className: "w-16 justify-center" },
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