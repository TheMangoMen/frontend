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

const parseJobs = (text: string): Job[] => {
    const jobs: Job[] = [];
    const lines = text.split("\n").map((line) => line.trim());

    // Find all instances of "preview" followed by "print" and "cancel"
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "preview") {
            // Look for "print" after "preview"
            let printIndex = -1;
            for (let j = i + 1; j < lines.length && j < i + 5; j++) {
                if (lines[j] === "print") {
                    printIndex = j;
                    break;
                }
            }

            if (printIndex === -1) continue;

            // // This is only works when the job deadline has not passed (i.e. users can still cancel the application)
            // // Look for "cancel" after "print"
            // let cancelIndex = -1;
            // for (
            //     let k = printIndex + 1;
            //     k < lines.length && k < printIndex + 5;
            //     k++
            // ) {
            //     if (lines[k] === "cancel") {
            //         cancelIndex = k;
            //         break;
            //     }
            // }
            // if (cancelIndex === -1) continue;
            // // Start parsing job data after "cancel"
            // let jobStartIndex = cancelIndex + 1;

            // Start parsing job data after "print"
            let jobStartIndex = printIndex + 1;

            // Skip any empty lines
            while (
                jobStartIndex < lines.length &&
                lines[jobStartIndex] === ""
            ) {
                jobStartIndex++;
            }

            if (jobStartIndex >= lines.length) continue;

            const currentJob: Partial<Job> = {
                season: "Winter",
                year: 2026,
                cycle: 1,
            };

            // Job Title
            if (lines[jobStartIndex]) {
                currentJob.title = lines[jobStartIndex];
                jobStartIndex++;
            }

            // Job ID
            if (lines[jobStartIndex]) {
                currentJob.job_id = parseInt(lines[jobStartIndex], 10);
                jobStartIndex++;
            }

            // Term (format: "2026 - Winter")
            if (lines[jobStartIndex]) {
                const termParts = lines[jobStartIndex].split(" - ");
                if (termParts.length === 2) {
                    currentJob.year = parseInt(termParts[0], 10);
                    currentJob.season = termParts[1];
                }
                jobStartIndex++;
            }

            // Organization (Company)
            if (lines[jobStartIndex]) {
                currentJob.company = lines[jobStartIndex];
                jobStartIndex++;
            }

            // Skip App Status, Job Status, Division
            jobStartIndex += 3;

            // Location (format: "USA - West")
            if (lines[jobStartIndex]) {
                currentJob.location = lines[jobStartIndex];
                jobStartIndex++;
            }

            // City
            if (lines[jobStartIndex]) {
                // Combine location and city for better location info
                if (currentJob.location) {
                    currentJob.location = `${currentJob.location}, ${lines[jobStartIndex]}`;
                } else {
                    currentJob.location = lines[jobStartIndex];
                }
                jobStartIndex++;
            }

            // Openings
            if (lines[jobStartIndex]) {
                const openings = parseInt(lines[jobStartIndex], 10);
                currentJob.openings = isNaN(openings) ? 1 : openings;
                jobStartIndex++;
            }

            // Add the job if we have all required fields
            if (currentJob.job_id && currentJob.title && currentJob.company) {
                jobs.push(currentJob as Job);
            }
        }
    }

    return jobs;
};

const JobIDExtractor: React.FC<JobIDExtractorProps> = ({ refresh }) => {
    const { token } = useAuth();
    const { toast } = useToast();

    const showErrorToast = () =>
        toast({
            variant: "destructive",
            title: "An error occurred while trying to populate your watchlist. We reccomend using Google Chrome when copying.",
        });

    const showParseErrorToast = () =>
        toast({
            variant: "destructive",
            title: "No jobs found, please try copying the table again. We reccomend using Google Chrome when copying.",
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
                    body: JSON.stringify(jobs),
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
