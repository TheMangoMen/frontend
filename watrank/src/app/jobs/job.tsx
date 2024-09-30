import { Company } from "./company";
import { Status } from "./status";
import { Tags } from "./tags";
export type Job = {
	archived: boolean;
	inprogress: boolean;
	jid: number;
	title: string;
	company: string;
	location: string;
	openings: number;
	oa: number;
	interview: number[];
	offer: number;
};
