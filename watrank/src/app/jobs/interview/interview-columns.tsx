"use client";
import { Job } from "../table-shared/job";
import {
    InterviewCountCell,
    OACountCell,
    OfferCountCell,
} from "../table-shared/count-cell";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Contribute from "../table-shared/contribute";
import JobCell from "../table-shared/job-cell";
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
        cell: ({ row, table }) => (
            <InterviewCountCell value={row.getValue("Interview")} />
        ),
        meta: { className: "w-20 justify-center" },
    },
    {
        accessorKey: "Offer",
        header: "Offer",
        enableHiding: false,
        cell: ({ row, table }) => (
            <OfferCountCell value={row.getValue("Offer")} />
        ),
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
        meta: { className: "flex-1 justify-start fs-mask" },
        sortingFn: (rowA, rowB) =>
            rowA.original.company.localeCompare(rowB.original.company),
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
        meta: { className: "w-32 fs-mask" },
    },
    {
        accessorKey: "openings",
        header: "Openings",
        meta: { className: "w-20 fs-mask" },
    },
    {
        accessorKey: "jid",
        header: "ID",
        meta: { className: "w-20 fs-mask" },
    },
];
