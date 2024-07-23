"use client";
import { Job } from "./job";
import { Tags } from "./tags";
import { ColumnDef, Row, Table, useReactTable } from "@tanstack/react-table";
import { DollarSign, EditIcon } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Stepper from "@/components/ui/stepper";
import { Status } from "./status";
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
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Loading = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(function Skeley(props, forwardedRef) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-primary/10",
				"w-[24px] h-[24px] bg-zinc-100 dark:bg-muted"
			)}
			{...props}
			ref={forwardedRef}
		/>
	);
});

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

function Contribute({ row }: { row: Row<Job> }) {
	const { token, isLoggedIn, authIsLoading } = useAuth();
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
					interviewcount: data.interviewcount == 0 ? 1 : data.interviewcount,
					compensation: data.compensation,
				};

				if (data.oadifficulty) formData.oadifficulty = data.oadifficulty;
				if (data.oalength) formData.oalength = data.oalength;
				if (data.interviewvibe) formData.interviewvibe = data.interviewvibe;
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
				toast({ variant: "destructive", title: "Failed to fetch data." });
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
	}, [open, isLoggedIn]);

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
				toast({ title: "Thank you for your contribution!" });
				setOpen(false);
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
							{isLoggedIn() ? "Contribute your status" : "Log in to contribute"}
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
							<EditIcon className="w-5" />
						</Button>
					</TooltipTrigger>
				</Tooltip>
			</DialogTrigger>
			<DialogContent className="max-h-full overflow-scroll">
				<DialogHeader>
					<DialogTitle>
						{row.getValue("title")}
						<span className="text-primary"> @ </span>
						{row.getValue("company")}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<Accordion
							type="multiple"
							className="w-full"
							value={status}
							onValueChange={(value) => setStatus(value)}
						>
							<AccordionItem value="OA">
								<AccordionTrigger className="font-bold">OA</AccordionTrigger>
								<AccordionContent className="px-4">
									<div className="grid sm:grid-cols-2 bg-muted/70 p-4 rounded-md space-y-4 sm:space-y-0">
										<FormField
											control={form.control}
											name="oadifficulty"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel>Difficulty</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex flex-col space-y-1"
														>
															{["Easy", "Medium", "Hard"].map((value) => (
																<FormItem
																	key={value}
																	className="flex items-center space-x-3 space-y-0"
																>
																	<FormControl>
																		<RadioGroupItem value={value} />
																	</FormControl>
																	<FormLabel className="font-normal">
																		{value}
																	</FormLabel>
																</FormItem>
															))}
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="oalength"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel>Length</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex flex-col space-y-1"
														>
															{[
																"Under 1 Hour",
																"1 to 2 Hours",
																"Over 2 Hours",
															].map((value) => (
																<FormItem
																	key={value}
																	className="flex items-center space-x-3 space-y-0"
																>
																	<FormControl>
																		<RadioGroupItem value={value} />
																	</FormControl>
																	<FormLabel className="font-normal">
																		{value}
																	</FormLabel>
																</FormItem>
															))}
														</RadioGroup>
													</FormControl>
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
													<FormLabel>What round of interview?</FormLabel>
													<Select
														value={field.value?.toString()}
														onValueChange={(value) =>
															form.setValue("interviewcount", Number(value))
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a round" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="1">Interview #1</SelectItem>
															<SelectItem value="2">Interview #2</SelectItem>
															<SelectItem value="3">Interview #3</SelectItem>
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
														<FormLabel>What were the vibes?</FormLabel>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																defaultValue={field.value}
																className="flex flex-col space-y-1"
															>
																{["Bad", "Good", "Neutral"].map((value) => (
																	<FormItem
																		key={value}
																		className="flex items-center space-x-3 space-y-0"
																	>
																		<FormControl>
																			<RadioGroupItem value={value} />
																		</FormControl>
																		<FormLabel className="font-normal">
																			{value}
																		</FormLabel>
																	</FormItem>
																))}
															</RadioGroup>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="interviewtechnical"
												render={({ field }) => (
													<FormItem className="space-y-3">
														<FormLabel>How technical was it?</FormLabel>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																defaultValue={field.value}
																className="flex flex-col space-y-1"
															>
																{["Non-technical", "Somewhat", "Technical"].map(
																	(value) => (
																		<FormItem
																			key={value}
																			className="flex items-center space-x-3 space-y-0"
																		>
																			<FormControl>
																				<RadioGroupItem value={value} />
																			</FormControl>
																			<FormLabel className="font-normal">
																				{value}
																			</FormLabel>
																		</FormItem>
																	)
																)}
															</RadioGroup>
														</FormControl>
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
												<FormLabel>Compensation (CAD / hour)</FormLabel>
												<FormControl>
													<Input
														startIcon={DollarSign}
														type="number"
														value={field.value?.toString()}
														onChange={(e) => {
															const value = e.target.value;
															if (!isNaN(Number(value))) {
																field.onChange(Number(value));
															} else {
																field.onChange(Number(201));
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
						<Button type="submit">Contribute</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
function Watching({ row, table }: { row: Row<Job>; table: Table<Job> }) {
	const { token, isLoggedIn, authIsLoading } = useAuth();
	const { toast } = useToast();
	const [watching, setWatching] = React.useState(false);

	const showErrorToast = () =>
		toast({
			variant: "destructive",
			title: "An error occurred while trying to update your watchlist.",
		});

	async function toggleWatch(isWatching: boolean) {
		const data = {
			jids: [row.getValue("jid")],
			delete: isWatching,
		};

		// Update table data state (so column filters are updated)
		table.options.meta?.updateData(row.index, "watching", !isWatching);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/watching`,
				{
					method: "POST",
					headers: {
						...(!!token && { Authorization: `Bearer ${token}` }),
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			if (!response.ok) {
				showErrorToast();
				table.options.meta?.updateData(row.index, "watching", isWatching); // reset
			} else {
				setWatching(!watching);
				toast({ title: "Updated your watch list!" });
			}
		} catch (error) {
			console.error(error);
			showErrorToast();
		}
	}

	// Use useEffect to set the initial state
	React.useEffect(() => {
		setWatching(row.getValue("watching") ?? false);
	}, [row]);

	return (
		<div className="h-full w-full flex justify-center">
			<Tooltip>
				<TooltipContent>
					<p>
						{isLoggedIn()
							? "Update your watch list"
							: "Log in to start a watch list"}
					</p>
				</TooltipContent>
				<TooltipTrigger>
					<Button
						disabled={!isLoggedIn()}
						onClick={() => toggleWatch(watching)}
						key={row.id}
						className={`text-primary ${
							!watching && "text-transparent"
						} disabled:text-foreground/50 hover:text-primary h-full flex p-1`}
						variant="ghost"
					>
						<StarFilledIcon />
					</Button>
				</TooltipTrigger>
			</Tooltip>
		</div>
	);
}
//call contributions, dipslay horizontal flex-box of badges
function TagBadges({ tags }: { tags: Tags }) {
	if (!tags){
		return null;
	}
	//to-do: systemic enum changes to not have "somewhat interview"s
	let tech = tags.interviewtechnical
	if (tags.interviewtechnical == "Somewhat"){
		tech = "Mixed"
	}

	return (
		<div className="max-md:hidden">
			<div className="flex flex-wrap flex-row gap-2">
				{tags.oadifficulty && <Badge>{`${tags.oadifficulty} OA`}</Badge>}
				{tags.interviewvibe && (
					<Badge>{`${tags.interviewvibe} Vibes`}</Badge>
				)}
				{tags.interviewtechnical && (
					<Badge>{`${tech} Interview`}</Badge>
				)}
			</div>
		</div>
		
	);
}

export const columns: ColumnDef<Job>[] = [
	{
		accessorKey: "watching",
		header: "",
		cell: ({ row, table }) => {
			return <Watching row={row} table={table} />;
		},
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
			const title: string = row.getValue("title");
			const jid: string = row.getValue("jid");
			const tags: Tags = row.original.tags;
			return (
				<div className="grid grid-cols-1 gap-2 justify-items-start">
					<a
						href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm?ck_jobid=${jid}`}
						className="hover:underline"
						target="_blank"
					>
						{title}
					</a>
					<TagBadges tags={tags} />
				</div>
			);
		},
	},
	{
		accessorKey: "company",
		header: "Company",
		enableHiding: false,
		cell: ({ row }) => {
			const company: string = row.getValue("company");
			return <div className="max-w-40">{company}</div>;
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
			const stages: Status[] = row.getValue("stages");
			return <Stepper key={row.id} steps={stages} />;
		},
	},
	{
		accessorKey: "",
		id: "contribute",
		header: "",
		cell: ({ row }) => {
			return <Contribute row={row} />;
		},
		enableHiding: false,
	},
];
