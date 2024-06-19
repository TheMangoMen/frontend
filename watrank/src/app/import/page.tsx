"use client"

import * as React from "react"

import { useToast } from "@/components/ui/use-toast"
import JobIDExtractor from "@/components/ui/job-id-extractor"

export default function ImportPage() {
    return (
        <div className="container flex-col items-center justify-center grid lg:max-w-none lg:px-0 h-full">
                    <JobIDExtractor></JobIDExtractor>
        </div>
    )

}