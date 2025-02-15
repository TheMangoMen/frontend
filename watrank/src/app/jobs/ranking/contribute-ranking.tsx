"use client";

import confetti from "canvas-confetti";
import { Job } from "../table-shared/job";
import { SquarePlus, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Row } from "@tanstack/react-table";

const NOT_INTERESTED_NUM = -1;
const NOT_INTERESTED_STRING = "Not Interested";

const EmployerRanking = z.enum(["Offer", "Ranked"]);
const UserRanking = z.enum([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    NOT_INTERESTED_STRING,
]);

const formSchema = z.object({
    employerRanking: EmployerRanking,
    userRanking: UserRanking,
});

export default function ContributeStatus({
    row,
    refresh,
    icon,
    tooltipText,
}: {
    row: Row<Job>;
    refresh: any;
    icon: React.ReactNode;
    tooltipText: string;
}) {
    const { token, isLoggedIn } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Function to fetch data from the backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ranking/${row.getValue(
                    "jid"
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();

                form.reset({
                    employerRanking: data.employerranking,
                    userRanking: data.userranking,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch data.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "An error occurred while fetching data.",
            });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (open && isLoggedIn()) {
            fetchData();
        }
    }, [open]);

    const showErrorToast = () =>
        toast({ variant: "destructive", title: "An error occured." });

    async function onDelete() {
        try {
            const jid = row.getValue("jid");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ranking/${jid}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                showErrorToast();
            } else {
                toast({ title: "Your contribution has been deleted!" });
                setOpen(false);
                refresh();
            }
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    async function onSubmit({
        employerRanking,
        userRanking,
    }: z.infer<typeof formSchema>) {
        const data = {
            jid: row.getValue("jid"),
            employerRanking,
            userRanking:
                userRanking === NOT_INTERESTED_STRING
                    ? NOT_INTERESTED_NUM
                    : parseInt(userRanking),
        };
        console.log("submitting");
        console.log(data);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/rankings`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                showErrorToast();
            } else {
                toast({ title: "Thank you for your contribution!" });
                confetti({
                    particleCount: 30,
                    spread: 120,
                });
                setOpen(false);
                refresh();
            }
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!isLoggedIn()}>
                <Tooltip>
                    <TooltipContent>
                        <p>
                            {isLoggedIn()
                                ? tooltipText
                                : "Log in to contribute"}
                        </p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Button
                            disabled={!isLoggedIn()}
                            onClick={() => isLoggedIn()}
                            key={row.id}
                            className={`text-foreground/60 hover:text-foreground h-full flex p-1`}
                            variant="ghost"
                        >
                            {icon}
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </DialogTrigger>
            <DialogContent className="max-h-full">
                <DialogHeader>
                    <DialogTitle className="fs-mask">
                        {row.original.title}
                        <span className="text-primary"> @ </span>
                        {row.original.company}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div className="grid lg:grid-cols-2 mb-8 gap-x-10 gap-y-5">
                            <FormField
                                control={form.control}
                                name="employerRanking"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employer Ranking</FormLabel>
                                        <Select
                                            value={field.value?.toString()}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {EmployerRanking.options.map(
                                                    (option, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userRanking"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Ranking</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <div className="p-2 flex flex-col gap-2">
                                                    <div className="flex justify-center border-b">
                                                        <SelectItem
                                                            value="1"
                                                            className="flex items-center justify-center py-2 px-4 cursor-pointer hover:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-bold [&>svg]:hidden"
                                                        >
                                                            1
                                                        </SelectItem>
                                                    </div>
                                                    <div className="flex justify-center gap-2">
                                                        {["2", "3", "4"].map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                    className="flex items-center justify-center py-2 px-4 cursor-pointer hover:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-bold [&>svg]:hidden"
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center gap-2">
                                                        {["5", "6", "7"].map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                    className="flex items-center justify-center py-2 px-4 cursor-pointer hover:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-bold [&>svg]:hidden"
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center gap-2">
                                                        {["8", "9", "10"].map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                    className="flex items-center justify-center py-2 px-4 cursor-pointer hover:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-bold [&>svg]:hidden"
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="border-t mt-2 pt-2">
                                                    <SelectItem
                                                        value={
                                                            NOT_INTERESTED_STRING
                                                        }
                                                        className="w-full flex items-center justify-center p-2 cursor-pointer hover:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-bold [&>svg]:hidden"
                                                    >
                                                        {NOT_INTERESTED_STRING}
                                                    </SelectItem>
                                                </div>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <Button type="submit" className="font-bold">
                                Contribute
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onDelete}
                                size="sm"
                            >
                                <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
