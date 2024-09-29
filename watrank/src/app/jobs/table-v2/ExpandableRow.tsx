import React from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { CheckIcon, ChevronDown, ChevronRight, XIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InterviewRound, OACheck, OfferCheck } from "./expanded-count-cell";
import { formatDate, stageCountFn } from "@/utils/utils";
import { Tags } from "../tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cellStyles } from "./count-cell";

interface ExpandableRowProps<TData> {
	row: Row<TData>;
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
		<div className="flex flex-wrap flex-row gap-2">
			{tags.oadifficulty &&
				<Badge className={cn(Object.values(cellStyles.OA))}>
					{`${tags.oadifficulty} OA`}
				</Badge>}
			{tags.interviewvibe &&
				<Badge className={cn(Object.values(cellStyles.interview))}>
					{`${tags.interviewvibe} Vibes`}
				</Badge>}
			{tags.interviewtechnical &&
				<Badge className={cn(Object.values(cellStyles.interview))}>
					{`${tech} Interview`}</Badge>
			}
		</div>
	);
}

// {
// 	"stages": [
// 		{
// 			"name": "OA",
// 			"count": 0
// 		},
// 		{
// 			"name": "Interview Stage",
// 			"count": 1
// 		},
// 		{
// 			"name": "Offer Call",
// 			"count": 0
// 		}
// 	],
// 		"tags": {
// 		"oadifficulty": "",
// 			"oalength": "",
// 				"interviewvibe": "",
// 					"interviewtechnical": "",
// 						"compensation": 0
// 	},
// 	"logtime": "2024-09-23T14:45:23.948568Z"
// }

function parseContribution(contribution: any) {
	const stageCount = stageCountFn(contribution.stages)

	return {
		gotOA: stageCount("OA")?.count === 1,
		interviewRound: stageCount("Interview Stage")?.count,
		gotOffer: stageCount("Offer Call")?.count === 1,
		tags: contribution.tags,
		contributionTime: new Date(contribution.logtime)
	};
}

const ExpandableRow = ({ row }: any) => {
	const { toast } = useToast();
	const { token, isLoggedIn } = useAuth();
	const [isExpanded, setIsExpanded] = React.useState(false);
	const [contributionData, setContributionData] = useState([]);

	const disabled = ["OA", "Interview", "Offer"]
		.map((s: any) => row.original[s])
		.every(i => i === 0)

	// Simulated API cal
	const fetchExpandedData = async (id: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/jobs/specific/${row.getValue("jid")}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},

				}
			);
			if (response.ok) {
				const data = await response.json();

				setContributionData(data)
				console.log("contributt", data);
			} else {
				toast({ variant: "destructive", title: "Failed to fetch data." });
			}
		} catch (error) {
			console.error(error);
			toast({ variant: "destructive", title: "Failed to fetch data." });
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ["expandedData", row.id],
		queryFn: () => fetchExpandedData(row.id as string),
		enabled: isExpanded,
	});

	return (
		<>
			<TableRow
				key={row.id}
				className={`flex cursor-pointer hover:bg-secondary ${isExpanded ? "bg-secondary" : ""}`}
				data-state={row.getIsSelected() && "selected"}
				onClick={() => !disabled && setIsExpanded(!isExpanded)}
			>
				{row.getVisibleCells().map((cell: any) =>
					<TableCell
						key={cell.id}
						className={`flex items-center grow-0 shrink-0 ${cell.column.columnDef.meta?.className}`}
					>
						{cell.column.id === 'isOpen' && !disabled
							? <div className="ml-2 w-4 h-4 flex items-center text-secondary-foreground">
								{isExpanded
									? <ChevronDown />
									: <ChevronRight />}
							</div>
							: flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				)}
			</TableRow >
			{isExpanded && (
				contributionData.map((contribution: any) => {
					const { gotOA, interviewRound, gotOffer, tags, contributionTime } = parseContribution(contribution);

					return <TableRow
						key={contributionTime.toDateString()}
						className="flex bg-secondary hover:bg-secondary"
					>
						{row.getVisibleCells().map((cell: any) => {
							const DefaultCell = ({ children }: { children?: React.ReactNode[] | React.ReactNode }) =>
								<TableCell
									key={cell.id}
									className={`flex items-center grow-0 shrink-0 ${cell.column.columnDef.meta?.className}`}
								>
									{children}
								</TableCell>

							let render;
							switch (cell.column.id) {
								case "isOpen":
									render = <DefaultCell />
									break;
								case "OA":
									render = <DefaultCell>
										{gotOA && <OACheck />}
									</DefaultCell>
									break;
								case "Interview":
									render = <DefaultCell>
										{interviewRound && <InterviewRound round={interviewRound} />}
									</DefaultCell>
									break;
								case "Offer":
									render = <DefaultCell>
										{gotOffer && <OfferCheck />}
									</DefaultCell>
									break;
								case "job":
									render = <DefaultCell>
										<div className="text-secondary-foreground mr-2">
											{formatDate(contributionTime)}
										</div>
										<TagBadges tags={tags} />
									</DefaultCell>
									break;
							}
							return render
						})}
					</TableRow>
				}))
			}
		</>
	);
};

export default ExpandableRow;
