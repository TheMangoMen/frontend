import React from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { CheckIcon, ChevronDown, ChevronRight, XIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EmployerRanking, InterviewRound, OACheck, OfferCheck, UserRanking } from "./expanded-count-cell";
import { formatDate, stageCountFn } from "@/utils/utils";
import { Tags } from "../tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cellStyles } from "./count-cell";

interface ExpandableRankingRowProps<TData> {
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

const ExpandableRankingRow = ({ row }: any) => {
	const { toast } = useToast();
	const { token, isLoggedIn } = useAuth();
	const [isExpanded, setIsExpanded] = React.useState(false);
	const [contributionData, setContributionData] = useState([]);

	const disabled = ["userranking", "employerranking"]
		.map((s: any) => row.original[s])
		.every(i => i === 0)

	// Simulated API cal
	const fetchExpandedData = async (id: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/jobs/specific/ranking/${row.getValue("jid")}`,
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
				contributionData.map((contribution: any, index: number) => {
					const { employerRanking, userRanking } = contribution;

					return <TableRow
						key={index}
						className="flex bg-secondary hover:bg-secondary"
					>
						
						<EmployerRanking rank={employerRanking} />
						<UserRanking rank={userRanking} />
						
						
								
							
					
					</TableRow>
				}))
			}
		</>
	);
};

export default ExpandableRankingRow;
