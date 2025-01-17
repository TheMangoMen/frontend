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
    ranking: number;
    taking: number;
    notTaking: number;
};
