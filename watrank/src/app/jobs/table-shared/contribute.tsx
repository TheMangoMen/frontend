import { Job } from "./job";
import { Row } from "@tanstack/react-table";
import { useGlobal } from "@/context/StageContext";
import ContributeStatus from "../interview/contribute-status";
import ContributeRanking from "../ranking/contribute-ranking";

export default function Contribute({ row, refresh }: { row: Row<Job>, refresh: any }) {
    const { isRankingStage } = useGlobal();

    const handleChildClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // This will prevent the parent's onClick from being triggered
    };

    return (
        <div onClick={handleChildClick}>
            {isRankingStage ? <ContributeRanking row={row} refresh={refresh} /> : <ContributeStatus row={row} refresh={refresh} />}
        </div>
    );
}
