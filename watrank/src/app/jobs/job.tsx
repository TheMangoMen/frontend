import { Company } from "./company";
import { Status } from "./status";
import { Tags } from "./tags";
export type Job = {
	watching: boolean;
	jid: number;
	title: string;
	company: Company;
	location: string;
	openings: number;
	stages: Status[];
	tags: Tags;
};
