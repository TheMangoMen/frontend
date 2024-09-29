import React from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";



interface ExpandableRowProps<TData> {
	row: Row<TData>;
}

const ExpandableRow = <TData,>({ row }: ExpandableRowProps<TData>) => {
    const { toast } = useToast();
    const { token, isLoggedIn } = useAuth();
	const [isExpanded, setIsExpanded] = React.useState(false);
    const [contributionData, setContributionData] = useState([]);

	// Simulated API cal
    const fetchExpandedData = async (id: string )=>{
        	try{
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
		
			
				}else {
					toast({ variant: "destructive", title: "Failed to fetch data." });
				}
			} catch (error){
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
				data-state={row.getIsSelected() && "selected"}
				onClick={() => setIsExpanded(!isExpanded)}
				className="cursor-pointer hover:bg-muted/50"
			>
				{row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
				<TableCell>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan={row.getVisibleCells().length + 1}>
						{isLoading ? (
							<div className="h-8 w-full animate-pulse bg-muted"></div>
						) : (
							contributionData.map((contribution : any) => (
								<TableRow key={contribution.logtime} className="bg-muted/30">
								  <TableCell colSpan={row.getVisibleCells().length + 1}>
									<div className="p-2">
									  {/* Replace this with the actual properties of your Contribution object */}
									  <p>Contribution ID: {contribution.logtime}</p>
									  {/* Add more properties here */}
									</div>
								  </TableCell>
								</TableRow>
							  ))
						)}
					</TableCell>
				</TableRow>
			)}
		</>
	);
};

export default ExpandableRow;
