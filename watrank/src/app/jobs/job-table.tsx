"use client";

import * as React from "react";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	VisibilityState,
	RowData,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AutofillPopup, AutofillPopupWithoutButton } from "@/components/autofill-popup";

declare module "@tanstack/table-core" {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

interface JobTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	setData(_: any): void;
	refresh: any;
}


interface CommandKeyProps {
	text: string;
}

const CommandKey: React.FC<CommandKeyProps> = ({ text }) => {
	const [commandKey, setCommandKey] = React.useState('');

	React.useEffect(() => {
		const isMac = navigator.userAgent.includes('Mac');
		setCommandKey(isMac ? '⌘ ' : 'Ctrl+');
	}, []);

	return (
		<span className="bg-muted p-1 rounded-md shadow-md">
			<code className="font-mono text-sm">{commandKey}{text}</code>
		</span>
	);
};

function useSkipper() {
	const shouldSkipRef = React.useRef(true);
	const shouldSkip = shouldSkipRef.current;

	// Wrap a function with this to skip a pagination reset temporarily
	const skip = React.useCallback(() => {
		shouldSkipRef.current = false;
	}, []);

	React.useEffect(() => {
		shouldSkipRef.current = true;
	});

	return [shouldSkip, skip] as const;
}

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = React.useState<boolean>(
		window.matchMedia(query).matches
	);

	React.useEffect(() => {
		const mediaQueryList = window.matchMedia(query);
		const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

		mediaQueryList.addEventListener("change", listener);
		return () => mediaQueryList.removeEventListener("change", listener);
	}, [query]);

	return matches;
};

export function JobTable<TData, TValue>({
	columns,
	data,
	setData,
	refresh,
}: JobTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const isMobile = useMediaQuery("(max-width: 768px)");

	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnVisibility,
			columnFilters,
		},
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},

		autoResetPageIndex,
		meta: {
			// https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
			// https://github.com/TanStack/table/tree/241f26fc0b9e1945c996926dfc127c7f8cc97fcf/examples/react/editable-data
			updateData: (rowIndex: any, columnId: any, value: any) => {
				// Skip page index reset until after next rerender
				skipAutoResetPageIndex();
				setData((old: any) =>
					old.map((row: any, index: any) => {
						if (index === rowIndex) {
							return {
								...old[rowIndex]!,
								[columnId]: value,
							};
						}
						return row;
					})
				);
			},
		},
	});
	const { isLoggedIn } = useAuth();

	React.useEffect(() => {
		table
			.getAllColumns()
			.filter((column) => column.getCanHide())
			.map((column) => {
				column.toggleVisibility(isMobile ? false : true);
			});
	}, [isMobile, table]);


	React.useEffect(() => {
		const handleKeyPress = (event: any) => {
			if ((event.key === "w" || event.key === "W") && event.shiftKey) {
				// Get the current value of the toggle
				const currentValue =
					(table.getColumn("watching")?.getFilterValue() as boolean) ?? false;

				// Toggle the value
				table.getColumn("watching")?.setFilterValue(!currentValue || null);
			}
		};

		// Attach the event listener
		window.addEventListener("keydown", handleKeyPress);

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [table]);

	return (
		<div>
			<div className="pb-5 flex gap-5 justify-between">
				<div className="flex gap-2">
					<Input
						className="max-w-60 bg-background"
						placeholder="Filter by company..."
						value={
							(table.getColumn("company")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("company")?.setFilterValue(event.target.value)
						}
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								variant="outline"
								pressed={
									(table.getColumn("watching")?.getFilterValue() as boolean) ?? false
								}
								onPressedChange={(value) =>
									table.getColumn("watching")?.setFilterValue(value || null)
								}
								className={`bg-background ${!isLoggedIn() && "hidden"}`}
							>
								<StarFilledIcon className="text-primary" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>
							You can also press <strong>Shift + W</strong> to toggle
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="max-sm:hidden flex gap-2">
					<Button onClick={refresh} variant="outline">
						<RefreshCw strokeWidth={3} size={"1rem"} className="text-primary" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.columnDef.header?.toString() || column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border bg-background">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<AutofillPopupWithoutButton/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 pt-5">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
