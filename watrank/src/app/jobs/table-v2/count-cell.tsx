import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import React from "react";
import { ExternalLink } from "lucide-react";

interface CountCellProps {
	count: number;
	textColor: string;
	bgColor: string;
}

const CountCell: React.FC<CountCellProps> = ({ count, textColor, bgColor }) => {
	return (
		<div
			className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
				count > 0 ? bgColor : ""
			} ${count > 0 ? textColor : "text-dark-grey/80"}`}
		>
			<span className={`font-bold`}>{count}</span>
		</div>
	);
};

export default CountCell;
