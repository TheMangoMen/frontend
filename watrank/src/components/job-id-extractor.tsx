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
  const lines = text.split('\n');
  
  let currentJob: Partial<Job> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Start of a new job entry
    if (line === 'preview' && lines[i + 1]?.trim() === 'print') {
      // Save previous job if exists
      if (currentJob.job_id) {
        jobs.push(currentJob as Job);
      }
      
      // Reset for new job
      currentJob = {
        season: "Fall",
        year: 2025,
        cycle: 1
      };
      
      // Skip the 'print' line
      i++;
      
      // Next line should be the title
      if (lines[i + 1]) {
        currentJob.title = lines[i + 1].trim();
        i++;
      }
      
      // Next line should be job ID
      if (lines[i + 1]) {
        currentJob.job_id = parseInt(lines[i + 1].trim(), 10);
        i++;
      }
      
      // Skip the term line
      i++;
      
      // Next line should be company
      if (lines[i + 1]) {
        currentJob.company = lines[i + 1].trim();
        i++;
      }

      // Look ahead for the date line
      let j = i + 1;
      while (j < lines.length) {
        const currentLine = lines[j].trim();
        // Match date format: Month DD, YYYY H:MM AM/PM
        if (/[A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M/.test(currentLine)) {
          // The line two before the date is the city
          if (j >= 2) {
            currentJob.location = lines[j - 2].trim();
          }
          // The line right before the date is the openings
          if (j >= 1) {
            const openings = parseInt(lines[j - 1].trim(), 10);
            currentJob.openings = isNaN(openings) ? 1 : openings;
          }
          break;
        }
        j++;
      }
      i = j; // Skip to where we found the date
    }
  }
  
  // Add the last job if exists
  if (currentJob.job_id) {
    jobs.push(currentJob as Job);
  }
  
  return jobs;
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
