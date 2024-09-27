import { Job } from "./job";
import { Row } from "@tanstack/react-table";
import { useGlobal } from "@/context/StageContext";
import ContributeStatus from "./contribute-status";
import ContributeRanking from "./contribute-ranking";

export default function Contribute({ row, refresh }: { row: Row<Job>, refresh: any }) {
    const { isRankingStage } = useGlobal();
    return isRankingStage ? <ContributeRanking row={row} refresh={refresh} /> : <ContributeStatus row={row} refresh={refresh} />;
}
