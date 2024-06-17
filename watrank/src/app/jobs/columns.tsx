"use client"
import { Job } from "./job"
import { ColumnDef, Row } from "@tanstack/react-table"
import { EditIcon } from "lucide-react"
import { StarFilledIcon } from "@radix-ui/react-icons"
import Stepper from "@/components/ui/stepper"
import { Status } from "./status"
import { ComboBoxResponsive } from "@/components/ui/combo-box-responsive"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export type Stage = {
    value: string
    label: string
}

const statuses: Stage[] = [
    {
        value: "None",
        label: "None",
    },
    {
        value: "Online Assessment",
        label: "OA",
    },
    {
        value: "Interview 1",
        label: "Interview 1",
    },
    {
        value: "Interview 2",
        label: "Interview 2",
    },
    {
        value: "Interview 3",
        label: "Interview 3",
    },
    {
        value: "Offer Call",
        label: "Offer Call",
    },
]

function Contribute({ row }: { row: Row<Job> }) {
    const { isLoggedIn, authIsLoading } = useAuth()
    const { toast } = useToast()
    const [open, setOpen] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState<Stage | null>(null)

    const handleSubmit = async () => {
        const data = {
            jID: row.getValue("jid"),
            status: selectedStatus
        };

        try {
            const response = await fetch("http://localhost:8080/contribution", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // const response = await fetch(`http://localhost:8080/jobs?uID=j12cole`);

            toast({ title: "Thank you for your contribution!" });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "An error occured." });
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>

        <TooltipProvider>
            <DialogTrigger disabled={!isLoggedIn()}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {authIsLoading ? <Skeleton className="w-[24px] h-[24px] bg-zinc-100 dark:bg-muted" />
                            : <EditIcon color={isLoggedIn() ? "currentColor" : "gray"} />}

                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isLoggedIn() ? "Contribute your status" : "Log in to contribute"}</p>
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
        </TooltipProvider>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {row.getValue("title")}
                    <span className="text-primary"> @ </span>
                    {row.getValue("company")}
                </DialogTitle>
            </DialogHeader>
            <form>
                <Label htmlFor="status">What's your status?</Label>
                <Select>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {statuses.map((status) => (
                            <SelectItem
                                key={status.value}
                                value={status.value}
                            >{status.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </form>
            <DialogFooter>
                <Button onClick={handleSubmit}>Contribute</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog >
}

export const columns: ColumnDef<Job>[] = [
    {
        accessorKey: "watching",
        header: "",
        cell: ({ row }) => {
            const isWatching = row.getValue("watching")
            return <a key={row.id} className={`${!isWatching && "text-transparent"} h-full w-full justify-center text-primary flex hover:text-primary`}><StarFilledIcon /></a>
        },
        enableHiding: false
    },
    {
        accessorKey: "jid",
        header: "ID"
    },
    {
        accessorKey: "title",
        header: "Title",
        enableHiding: false,
        cell: ({ row }) => {
            const title: string = row.getValue("title")
            return <div className="w-48">{title}</div>
        },
    },
    {
        accessorKey: "company",
        header: "Company",
        enableHiding: false,
        cell: ({ row }) => {
            const company: string = row.getValue("company")
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

            const stages: Status[] = row.getValue("stages")
            return <Stepper key={row.id} steps={stages} />
        },
    },
    {
        accessorKey: "",
        id: "contribute",
        header: "",
        cell: ({ row }) => {
            return <Contribute row={row} />

        },
        enableHiding: false
    },
]