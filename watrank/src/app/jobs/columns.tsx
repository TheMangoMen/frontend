"use client"
import { Job } from "./job"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Edit2Icon, Edit3Icon, EditIcon, MoreHorizontal } from "lucide-react"
import { EyeClosedIcon, EyeOpenIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import Stepper from "@/components/ui/stepper"
import { Status } from "./status"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ComboBoxResponsive } from "@/components/ui/combo-box-responsive"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Stage } from "@/components/ui/combo-box-responsive"
  
const uid = "j12cole"



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
        enableHiding: false,
        cell: ({ row }) => {
            const title :string = row.getValue("title")
            return <div className="w-48">{title}</div>
          },
    },
    {
        accessorKey: "company",
        header: "Company",
        enableHiding: false,
        cell: ({ row }) => {
            const company :string = row.getValue("company")
            return <div className="max-w-40">{company}</div>
          },
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
        header: "",
        cell: ({ row }) => {


            return<Dialog>
            <DialogTrigger><EditIcon/></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>What's your status for <span className="text-primary">{row.getValue("title")}</span> at <span className="text-primary">{row.getValue("company")}</span>?</DialogTitle>
                <DialogDescription>
                 
                </DialogDescription>
              </DialogHeader>
              <ComboBoxResponsive jID={row.getValue("jid")}></ComboBoxResponsive> 
            </DialogContent>
          </Dialog>
            
          },
        enableHiding: false
    },
]