import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Company } from "../company";
import React from 'react';
import { ExternalLink } from "lucide-react";

interface JobCellProps {
    company: string;
    title: string;
    jid: number;
}

const JobCell: React.FC<JobCellProps> = ({ company, title, jid }) => {
    return (
        <div className="">
            <p className="font-semibold">{company}</p>
            <a
                href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm?ck_jobid=${jid}`}
                className="hover:underline text-sm text-[#585858]"
                target="_blank"
                title="Open in WaterlooWorks"
            >
                {title} <ExternalLink className="inline w-3 h-3 mb-0.5" />
            </a>
        </div>
    );
};

export default JobCell;
