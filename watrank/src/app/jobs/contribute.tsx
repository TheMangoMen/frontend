import { Job } from "./job";
import { Row } from "@tanstack/react-table";
import { useGlobal } from "@/context/StageContext";
import ContributeStatus from "./contribute-status";
import ContributeRanking from "./contribute-ranking";

export default function Contribute({ row }: { row: Row<Job> }) {
    const { isRankingStage } = useGlobal();
    return isRankingStage ? <ContributeRanking row={row} /> : <ContributeStatus row={row} />;
}
