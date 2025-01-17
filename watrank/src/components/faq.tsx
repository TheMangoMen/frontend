"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion-default";

export function FAQ() {
    return (
        <div className="w-full max-w-3xl mx-auto px-6 md:px-8 py-8">
            <h2 className="text-3xl font-bold text-center mb-4">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is WatRank?</AccordionTrigger>
                    <AccordionContent>
                        A more searchable, personalized WaterlooWorks
                        megathread. More details{" "}
                        <a
                            href="https://www.reddit.com/r/uwaterloo/comments/1fsnsc5/watrank_v11_just_dropped_thank_you_for_your/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            here
                        </a>
                        .
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        Are contributions anonymous?
                    </AccordionTrigger>
                    <AccordionContent>Yes.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Can I trust the data?</AccordionTrigger>
                    <AccordionContent>
                        WatRank is a crowd-sourced platform, just like the
                        megathread.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
