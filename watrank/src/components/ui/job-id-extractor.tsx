"use client"
import React, { useState } from 'react';
const currentSeason = "Fall"

const JobIDExtractor: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [jobIDs, setJobIDs] = useState<string[]>([]);

    // Function to handle text change in the textarea
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    // Function to extract Job IDs from the provided text
    const extractJobIDs = (text: string) => {
        const jobIDRegex = /view\s+\d{4}\s+-\s+Fall\s+(\d{6})/g;
        let match: RegExpExecArray | null;
        const extractedJobIDs: string[] = [];
        while ((match = jobIDRegex.exec(text)) !== null) {
            extractedJobIDs.push(match[1]);
        }
        return extractedJobIDs;
    };

    // Function to handle the extraction process
    const handleExtractJobIDs = () => {
        const extractedJobIDs = extractJobIDs(text);
        setJobIDs(extractedJobIDs);
    };

    // Function to handle pasting text from the clipboard
    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <textarea
                    className="w-full h-40 p-2 border rounded"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Paste your text here"
                />
            </div>
            <div className="mb-4">
                <button
                    className="py-2 px-4 rounded mr-2"
                    onClick={handlePaste}
                >
                    Paste from Clipboard
                </button>
                <button
                    className="py-2 px-4 rounded"
                    onClick={handleExtractJobIDs}
                >
                    Extract Job IDs
                </button>
            </div>
            {jobIDs.length > 0 && (
                <div>
                    <h2 className="text-lg mb-2">Extracted Job IDs:</h2>
                    <ul className="list-disc pl-5">
                        {jobIDs.map((id, index) => (
                            <li key={index}>{id}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default JobIDExtractor;
