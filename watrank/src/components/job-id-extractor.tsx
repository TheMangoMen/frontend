"use client"
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ClipboardPaste } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './ui/use-toast';

const JobIDExtractor: React.FC = () => {
    const { token } = useAuth();
    const [jobIDs, setJobIDs] = useState<string[]>([]);
    const { toast } = useToast();

    async function updateWatchList(jids: number[]) {
        const data = {
            jids,
            delete: false
        };

        const showErrorToast = () =>
            toast({
                variant: "destructive",
                title: "An error occurred while trying to populate your watchlist.",
            });

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/watching`,
                {
                    method: "POST",
                    headers: {
                        ...(!!token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                showErrorToast();
            } else {
                toast({ title: "Populated your watch list!" });
            }
        } catch (error) {
            console.error(error);
            showErrorToast();
        }
    }

    // Function to extract Job IDs from the provided text
    const extractJobIDs = (text: string) => {
        const jobIDRegex = /view\s+\d{4}\s+-\s+Fall\s+(\d{6})/g;
        let match: RegExpExecArray | null;
        const extractedJobIDs: number[] = [];
        while ((match = jobIDRegex.exec(text)) !== null) {
            extractedJobIDs.push(parseInt(match[1]));
        }
        return extractedJobIDs;
    };

    const showParseErrorToast = () =>
        toast({
            variant: "destructive",
            title: "No jobs found, please try copying the table again.",
        });

    // Function to handle pasting text from the clipboard
    const handleClick = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const extractedJobIDs = extractJobIDs(clipboardText);
            if (extractedJobIDs?.length == 0) {
                showParseErrorToast()
                return
            }
            updateWatchList(extractedJobIDs);
            console.log(extractedJobIDs)
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    return (
        <div>
            <Button variant="outline" onClick={handleClick}>
                <ClipboardPaste className="mr-2 h-4 w-4" /> Paste from Clipboard
            </Button>
        </div>
    );
};

export default JobIDExtractor;
