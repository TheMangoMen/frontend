import { Job } from "./job";
import { Row } from "@tanstack/react-table";
import { useGlobal } from "@/context/StageContext";
import ContributeStatus from "../interview/contribute-status";
import ContributeRanking from "../ranking/contribute-ranking";
import { SquarePlus, Edit } from "lucide-react";

export default function Contribute({
    row,
    refresh,
}: {
    row: Row<Job>;
    refresh: any;
}) {
    const { isRankingStage } = useGlobal();
    const hasContributed = row.original.hasContributed;

    const handleChildClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // This will prevent the parent's onClick from being triggered
    };

    const icon = hasContributed ? (
        <Edit className="w-5 text-foreground/30 dark:text-foreground/80" />
    ) : (
        <SquarePlus className="w-5 text-primary" />
    );

    const tooltipText = hasContributed
        ? "Edit your contribution"
        : isRankingStage
        ? "Contribute your ranking"
        : "Contribute your status";

    return (
        <div onClick={handleChildClick}>
            {isRankingStage ? (
                <ContributeRanking
                    row={row}
                    refresh={refresh}
                    icon={icon}
                    tooltipText={tooltipText}
                />
            ) : (
                <ContributeStatus
                    row={row}
                    refresh={refresh}
                    icon={icon}
                    tooltipText={tooltipText}
                />
            )}
        </div>
    );
}
