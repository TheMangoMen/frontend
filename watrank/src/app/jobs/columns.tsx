"use client"
import { Job } from "./job"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Edit2Icon, Edit3Icon, EditIcon, MoreHorizontal } from "lucide-react"
import { EyeClosedIcon, EyeOpenIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import Stepper from "@/components/ui/stepper"
import { Status } from "./status"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const columns: ColumnDef<Job>[] = [
    {
        accessorKey: "watching",
        header: "",
        cell: ({ row }) => {
            const isWatching = row.getValue("watching")
            return <a key={row.id} className={`${!isWatching && "text-transparent"} h-full w-full justify-center text-primary flex hover:text-primary`}><StarFilledIcon/></a>
          },
        enableHiding: false
    },
    {
        accessorKey: "jid",
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
        enableHiding: false,
        size: 10,
        enableResizing: false,
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
            return <Stepper key={row.id} steps={stages}/>
          },
    },
    {
        accessorKey: "",
        id: "contribute",
        header: "Contribute",
        cell: ({ row }) => {
            return<Popover>
            <PopoverTrigger><div className="text-primary"><EditIcon/></div></PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
          },
        enableHiding: false
    },
]