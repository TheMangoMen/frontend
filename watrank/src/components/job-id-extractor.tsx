"use client";
import React from "react";
import { Button } from "./ui/button";
import { ClipboardPaste } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./ui/use-toast";

interface JobIDExtractorProps {
    refresh: () => void;
}

interface Job {
    job_id: number;
    title: string;
    company: string;
    location: string;
    openings: number;
    season: string;
    year: number;
    cycle: number;
}

const JOB_BLOCK_REGEX = /([\w\s&\-()\/]+)\n(\d{6})\n(\d{4} - \w+)\n(.+?)\n(?:Applied|Selected for Interview|Not Selected)[\s\S]+?\n(\d+)\n(?:[A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M)\n(?:[A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M)\nLillian Liu/gi;

const parseJobs = (text: string): Job[] => {
  const matches = [...text.matchAll(JOB_BLOCK_REGEX)];
  return matches.map(match => {
    const [_, title, jobIdStr, term, company, openingsStr] = match;

    const job_id = parseInt(jobIdStr, 10);
    const openings = parseInt(openingsStr, 10);

    const [yearStr, season] = term.split(" - ");
    const year = parseInt(yearStr, 10);

    // Cycle: we don't have cycle explicitly, so default 1 or infer based on date
    const cycle = 1;

    return {
      job_id,
      title: title.trim(),
      company: company.trim(),
      location: "", // You can add location parsing if needed later
      openings,
      season: season.trim(),
      year,
      cycle,
    };
  });
};


const JobIDExtractor: React.FC<JobIDExtractorProps> = ({ refresh }) => {
    const { token } = useAuth();
    const { toast } = useToast();

    const showErrorToast = () =>
        toast({
            variant: "destructive",
            title: "An error occurred while trying to populate your watchlist.",
        });

    const showParseErrorToast = () =>
        toast({
            variant: "destructive",
            title: "No jobs found, please try copying the table again.",
        });

    const showSuccessToast = () =>
        toast({
            title: "Populated your watch list!",
        });

    const updateWatchList = async (jobs: Job[]) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/watching`,
                {
                    method: "POST",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ jobs, delete: false }),
                }
            );

            if (!response.ok) {
                showErrorToast();
                return;
            }

            showSuccessToast();
            refresh();
        } catch (error) {
            console.error("Watchlist update failed:", error);
            showErrorToast();
        }
    };

    const handleClick = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            console.log("Clipboard preview:", clipboardText.slice(0, 200));

            const extractedJobs = parseJobs(clipboardText);
            if (extractedJobs.length === 0) {
                showParseErrorToast();
                return;
            }

            console.log("Extracted jobs:", extractedJobs);
            await updateWatchList(extractedJobs);
        } catch (error) {
            console.error("Clipboard read failed:", error);
        }
    };

    return (
        <div>
            <Button variant="outline" onClick={handleClick}>
                <ClipboardPaste className="mr-2 h-4 w-4" />
                Paste from Clipboard
            </Button>
        </div>
    );
};

export default JobIDExtractor;
