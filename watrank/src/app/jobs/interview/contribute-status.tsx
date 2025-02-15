"use client";

import { Job } from "../table-shared/job";
import {
    DollarSign,
    EditIcon,
    SquarePlus,
    Trash,
    Trash2,
    Trash2Icon,
    TrashIcon,
} from "lucide-react";
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/input";
import { Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

const Difficulty = z.enum(["Easy", "Medium", "Hard"]);
const Length = z.enum(["Under 1 Hour", "1 to 2 Hours", "Over 2 Hours"]);
const Vibe = z.enum(["Bad", "Good", "Neutral"]);
const Technical = z.enum(["Non-technical", "Somewhat", "Technical"]);

const formSchema = z.object({
    interviewcount: z.number().min(1).max(3).default(1),
    oadifficulty: Difficulty.optional(),
    oalength: Length.optional(),
    interviewvibe: Vibe.optional(),
    interviewtechnical: Technical.optional(),
    compensation: z.number().min(0).max(200).optional(),
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
    const [status, setStatus] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    // const [selectedStatus, setSelectedStatus] = React.useState<Stage | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Function to fetch data from the backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contribution/${row.getValue(
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

                // Prepopulate the form fields
                const formData: any = {
                    interviewcount:
                        data.interviewcount == 0 ? 1 : data.interviewcount,
                    compensation: data.compensation,
                };

                if (data.oadifficulty)
                    formData.oadifficulty = data.oadifficulty;
                if (data.oalength) formData.oalength = data.oalength;
                if (data.interviewvibe)
                    formData.interviewvibe = data.interviewvibe;
                if (data.interviewtechnical)
                    formData.interviewtechnical = data.interviewtechnical;

                form.reset(formData);

                // Open specific accordions based on data
                const accordionsToOpen = [];
                if (data.oa) accordionsToOpen.push("OA");
                if (data.interviewcount) accordionsToOpen.push("Interview");
                if (data.offercall) accordionsToOpen.push("OfferCall");
                setStatus(accordionsToOpen);
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

    const parseStatus = (stat: string[]) => {
        // Initialize a boolean array to keep track of the presence of each status
        let statusPresence = [false, false, false]; // [OA, interview, offercall]

        // Iterate through the stat array and update the boolean array accordingly
        for (const status of stat) {
            if (status === "OA") {
                statusPresence[0] = true;
            } else if (status === "Interview") {
                statusPresence[1] = true;
            } else if (status === "OfferCall") {
                statusPresence[2] = true;
            }
        }

        return statusPresence;
    };

    async function updateContribution(data: any, message: string) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contribution`,
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
                toast({ title: message });
                setOpen(false);
                refresh();
            }
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    async function onDelete() {
        const data = {
            jid: row.getValue("jid"),
            oa: null,
            interview: null,
            offercall: null,
            interviewcount: null,
            oadifficulty: null,
            oalength: null,
            interviewVibe: null,
            interviewTechnical: null,
            compensation: null,
        };
        console.log("deleting");
        console.log(data);
        await updateContribution(data, "Your contribution has been deleted!");
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const parsedStatus = parseStatus(status);
        console.log(parsedStatus);
        const data = {
            jid: row.getValue("jid"),
            oa: parsedStatus[0],
            interview: parsedStatus[1],
            offercall: parsedStatus[2],
            interviewcount: values.interviewcount ?? 0,
            oadifficulty: values.oadifficulty ?? null,
            oalength: values.oalength ?? null,
            interviewVibe: values.interviewvibe ?? null,
            interviewTechnical: values.interviewtechnical ?? null,
            compensation: values.compensation ?? null,
        };
        console.log("submitting");
        console.log(data);
        await updateContribution(data, "Thank you for your contribution!");
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
            <DialogContent className="max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle className="fs-mask">
                        {row.original.title}
                        <span className="text-primary"> @ </span>
                        {row.original.company}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <Accordion
                            type="multiple"
                            className="w-full"
                            value={status}
                            onValueChange={(value) => setStatus(value)}
                        >
                            <AccordionItem value="OA">
                                <AccordionTrigger className="font-bold">
                                    OA
                                </AccordionTrigger>
                                <AccordionContent className="px-4">
                                    <div className="grid sm:grid-cols-2 bg-muted/70 p-4 rounded-md space-y-4 sm:space-y-0">
                                        <FormField
                                            control={form.control}
                                            name="oadifficulty"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>
                                                        Difficulty (optional)
                                                    </FormLabel>
                                                    <div className="flex flex-col space-y-2">
                                                        {[
                                                            "Easy",
                                                            "Medium",
                                                            "Hard",
                                                        ].map((option) => (
                                                            <div
                                                                key={option}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        field.value ===
                                                                        option
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        field.onChange(
                                                                            checked
                                                                                ? option
                                                                                : undefined
                                                                        );
                                                                    }}
                                                                />
                                                                <FormLabel className="font-normal">
                                                                    {option}
                                                                </FormLabel>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="oalength"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>
                                                        Length (optional)
                                                    </FormLabel>
                                                    <div className="flex flex-col space-y-2">
                                                        {[
                                                            "Under 1 Hour",
                                                            "1 to 2 Hours",
                                                            "Over 2 Hours",
                                                        ].map((option) => (
                                                            <div
                                                                key={option}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        field.value ===
                                                                        option
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        field.onChange(
                                                                            checked
                                                                                ? option
                                                                                : undefined
                                                                        );
                                                                    }}
                                                                />
                                                                <FormLabel className="font-normal">
                                                                    {option}
                                                                </FormLabel>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="Interview">
                                <AccordionTrigger className="font-bold">
                                    Interview
                                </AccordionTrigger>
                                <AccordionContent className="px-4">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="interviewcount"
                                            defaultValue={1}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        What round of interview?
                                                    </FormLabel>
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            form.setValue(
                                                                "interviewcount",
                                                                Number(value)
                                                            )
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a round" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">
                                                                Interview #1
                                                            </SelectItem>
                                                            <SelectItem value="2">
                                                                Interview #2
                                                            </SelectItem>
                                                            <SelectItem value="3">
                                                                Interview #3
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid sm:grid-cols-2 bg-muted/70 p-4 mt-4 rounded-md space-y-5 sm:space-y-0">
                                            <FormField
                                                control={form.control}
                                                name="interviewvibe"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel>
                                                            What were the vibes?
                                                            (optional)
                                                        </FormLabel>
                                                        <div className="flex flex-col space-y-2">
                                                            {[
                                                                "Bad",
                                                                "Good",
                                                                "Neutral",
                                                            ].map((option) => (
                                                                <div
                                                                    key={option}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        checked={
                                                                            field.value ===
                                                                            option
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            field.onChange(
                                                                                checked
                                                                                    ? option
                                                                                    : undefined
                                                                            );
                                                                        }}
                                                                    />
                                                                    <FormLabel className="font-normal">
                                                                        {option}
                                                                    </FormLabel>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="interviewtechnical"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel>
                                                            How technical was
                                                            it? (optional)
                                                        </FormLabel>
                                                        <div className="flex flex-col space-y-2">
                                                            {[
                                                                "Non-technical",
                                                                "Somewhat",
                                                                "Technical",
                                                            ].map((option) => (
                                                                <div
                                                                    key={option}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        checked={
                                                                            field.value ===
                                                                            option
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            field.onChange(
                                                                                checked
                                                                                    ? option
                                                                                    : undefined
                                                                            );
                                                                        }}
                                                                    />
                                                                    <FormLabel className="font-normal">
                                                                        {option}
                                                                    </FormLabel>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="OfferCall">
                                <AccordionTrigger className="font-bold">
                                    Offer Call
                                </AccordionTrigger>
                                <AccordionContent className="px-4">
                                    <FormField
                                        control={form.control}
                                        name="compensation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Compensation (CAD / hour)
                                                    (optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        startIcon={DollarSign}
                                                        type="number"
                                                        value={field.value?.toString()}
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            if (
                                                                !isNaN(
                                                                    Number(
                                                                        value
                                                                    )
                                                                )
                                                            ) {
                                                                field.onChange(
                                                                    Number(
                                                                        value
                                                                    )
                                                                );
                                                            } else {
                                                                field.onChange(
                                                                    Number(201)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
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
