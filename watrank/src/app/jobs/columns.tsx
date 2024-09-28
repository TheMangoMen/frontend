"use client";
import { Job } from "./job";
import CountCell from "./table-v2/count-cell";
import { Tags } from "./tags";
import { ColumnDef, Row, Table, useReactTable } from "@tanstack/react-table";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Stepper from "@/components/ui/stepper";
import { Status } from "./status";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Contribute from "./contribute";
import JobCell from "./table-v2/job-cell";

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
	if (!tags) {
		return null;
	}
	//to-do: systemic enum changes to not have "somewhat interview"s
	let tech = tags.interviewtechnical;
	if (tags.interviewtechnical == "Somewhat") {
		tech = "Mixed";
	}

	return (
		<div className="max-md:hidden">
			<div className="flex flex-wrap flex-row gap-2">
				{tags.oadifficulty && <Badge>{`${tags.oadifficulty} OA`}</Badge>}
				{tags.interviewvibe && <Badge>{`${tags.interviewvibe} Vibes`}</Badge>}
				{tags.interviewtechnical && <Badge>{`${tech} Interview`}</Badge>}
			</div>
		</div>
	);
}

export const columns: ColumnDef<Job>[] = [
	// {
	//     accessorKey: "watching",
	//     header: <StarFilledIcon className="mx-auto"/>,
	//     cell: ({ row, table }) => {
	//         return <Watching row={row} table={table} />;
	//     },
	//     enableSorting: false, // This makes the column unsortable
	//     enableHiding: false,
	// },
	{
		accessorKey: "OA",
		header: <p className="text-center">OA</p>,
		cell: ({ row, table }) => {
			return (
				<CountCell
					count={3}
					textColor="text-dark-yellow"
					bgColor="bg-gold/50"
				/>
			);
		},
	},
	{
		accessorKey: "Interview",
		header: <p className="text-center">Interview</p>,
		cell: ({ row, table }) => {
			return (
				<CountCell
					count={3}
					textColor="text-dark-green"
					bgColor="bg-[#72eb45]/50"
				/>
			);
		},
	},
	{
		accessorKey: "Offer",
		header: <p className="text-center">Offer</p>,
		cell: ({ row, table }) => {
			return (
				<CountCell
					count={3}
					textColor="text-dark-blue"
					bgColor="bg-[#72eb45]/50"
				/>
			);
		},
	},
	{
		accessorKey: "job",
		header: "Job",
		enableHiding: false,
		cell: ({ row }) => {
			console.log(row.original.company);
			return (
				<JobCell
					title={row.original.title}
					company={row.original.company}
					jid={row.original.jid}
				/>
				// <div className="grid grid-cols-1 gap-2 justify-items-start min-w-20">
				//     <TagBadges tags={tags} />
				// </div>
			);
		},
		sortingFn: (rowA, rowB, columnId) => {
			return rowA.original.company.localeCompare(rowB.original.company);
		},
	},
	// {
	//     accessorKey: "title",
	//     header: "Title",
	//     enableHiding: false,
	//     cell: ({ row }) => {
	//         const title: string = row.getValue("title");
	//         const jid: string = row.getValue("jid");
	//         const tags: Tags = row.original.tags;
	//         return (
	//             <div className="grid grid-cols-1 gap-2 justify-items-start min-w-20">
	//                 <a
	//                     href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm?ck_jobid=${jid}`}
	//                     className="hover:underline"
	//                     target="_blank"
	//                 >
	//                     {title}
	//                 </a>
	//                 <TagBadges tags={tags} />
	//             </div>
	//         );
	//     },
	// },
	// {
	//     accessorKey: "company",
	//     header: "Company",
	//     enableHiding: false,
	//     cell: ({ row }) => {
	//         const company: string = row.getValue("company");
	//         return <div className="max-w-40 min-w-20">{company}</div>;
	//     },
	// },
	{
		accessorKey: "location",
		header: "Location",
	},
	{
		accessorKey: "openings",
		header: "Openings",
	},
	// {
	//     accessorKey: "stages",
	//     header: "Status",
	//     enableHiding: false,
	//     cell: ({ row }) => {
	//         const stages: Status[] = row.getValue("stages");
	//         return <Stepper key={row.id} steps={stages} />;
	//     },
	// },
	{
		accessorKey: "jid",
		header: "ID",
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
	},
];
