"use client"
import { Job } from "./job"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { EyeClosedIcon, EyeOpenIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import Stepper from "@/components/ui/stepper"
import { Status } from "./status"

export const columns: ColumnDef<Job>[] = [
    {
        accessorKey: "watching",
        header: "",
        cell: ({ row }) => {
            const isWatching = row.getValue("watching")
            return <a className={`${!isWatching && "text-transparent"} h-full w-full justify-center text-primary flex hover:text-primary`}><StarFilledIcon/></a>
          },
    },
    {
        accessorKey: "jID",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
        enableHiding: false
    },
    {
        accessorKey: "company",
        header: "Company",
        enableHiding: false
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "openings",
        header: "Openings",
    },
    {
        accessorKey: "stages",
        header: "Status",
        enableHiding: false,
        cell: ({ row }) => {

            const stages :Status[] = row.getValue("stages")
            return <Stepper steps={stages}/>
          },
    },
]