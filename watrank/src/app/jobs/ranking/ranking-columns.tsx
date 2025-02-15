"use client";
import { Job } from "../table-shared/job";
import {
    InterviewCountCell,
    NotTakingCountCell,
    OACountCell,
    OfferCountCell,
} from "../table-shared/count-cell";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Contribute from "../table-shared/contribute";
import JobCell from "../table-shared/job-cell";

export const rankingColumns: ColumnDef<Job>[] = [
    {
        accessorKey: "isOpen",
        header: "",
        enableHiding: false,
        meta: {
            className: "w-2 text-3 lg:w-8 justify-center",
        },
    },
    {
        accessorKey: "Ranked",
        header: "Ranked",
        enableHiding: false,
        cell: ({ row, table }) => (
            <OACountCell value={row.getValue("Ranked")} />
        ),
        meta: { className: "w-12 lg:w-14 justify-center text-xs lg:text-sm" },
    },
    {
        accessorKey: "NotTaking",
        header: "Not Taking",
        enableHiding: false,
        cell: ({ row, table }) => (
            <NotTakingCountCell value={row.getValue("NotTaking")} />
        ),
        meta: {
            className:
                "w-14 lg:w-24 text-center justify-center text-xs lg:text-sm",
        },
    },
    {
        accessorKey: "Taking",
        header: "Taking",
        enableHiding: false,
        cell: ({ row, table }) => (
            <InterviewCountCell value={row.getValue("Taking")} />
        ),
        meta: { className: "w-12 lg:w-14 justify-center text-xs lg:text-sm" },
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
        meta: { className: "w-12 flex-none text-xs lg:text-sm" },
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
        meta: { className: "flex-1 justify-start fs-mask text-xs lg:text-sm" },
        sortingFn: (rowA, rowB) =>
            rowA.original.company.localeCompare(rowB.original.company),
    },
    {
        accessorKey: "location",
        header: "Location",
        meta: { className: "w-32 fs-mask text-xs lg:text-sm" },
    },
    {
        accessorKey: "openings",
        header: "Openings",
        meta: { className: "w-20 fs-mask text-xs lg:text-sm" },
    },
    {
        accessorKey: "jid",
        header: "ID",
        meta: { className: "w-20 fs-mask text-xs lg:text-sm" },
    },
];
