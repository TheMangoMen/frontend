import React from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";


interface ExpandableRowProps<TData> {
	row: Row<TData>;
}

const ExpandableRow = <TData,>({ row }: ExpandableRowProps<TData>) => {
    const { token, isLoggedIn } = useAuth();
	const [isExpanded, setIsExpanded] = React.useState(false);

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

					const formData: any = {
						interviewcount: data.interviewcount == 0 ? 1 : data.interviewcount,
						compensation: data.compensation,
					};
	

		
			
				}} catch{
                    
                }
			
			
    }
	const fetchExpandedDataMock = async (id: string) => {

	

		await new Promise((resolve) => setTimeout(resolve, 500));
		return `Hello ${id}`;
	};

	const { data, isLoading } = useQuery({
		queryKey: ["expandedData", row.id],
		queryFn: () => fetchExpandedDataMock(row.id as string),
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
							<div className="p-2">{data}</div>
						)}
					</TableCell>
				</TableRow>
			)}
		</>
	);
};

export default ExpandableRow;
