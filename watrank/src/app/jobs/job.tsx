import { Company } from "./company";
import { Status } from "./status";
export type Job = {
	watching: boolean;
	jid: number;
	title: string;
	company: Company;
	location: string;
	openings: number;
	stages: Status[];
};
