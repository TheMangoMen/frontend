"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
type Interview = {
    id: string;
    title: string;
    company: string;
    topic: string;
    advice: string;
    tags: string[];
    date: string;
    likes?: number;
    dislikes?: number;
    details?: string;
};

const interviews: Interview[] = [
    {
        id: "1",
        likes: 3,
        dislikes: 0,
        date: "2025-11-03",
        title: "Senior SWE",
        company: "Shopify",
        topic: "Finding your first co-op",
        advice:
            "treat each application as practice. keep your resume short, quantify impact, and ship small projects you can demo in 2 minutes.",
        tags: ["resume", "projects", "interviews"],
        details:
            "Start with a simple, well-scoped project that solves a real problem for you or a friend. Write a concise README that explains the problem, approach, and trade-offs. When interviewing, walk through your decision tree: why this stack, how you tested, and what you'd improve with more time.",
    },
    {
        id: "2",
        date: "2025-11-01",
        title: "Machine Learning Engineer",
        company: "NVIDIA",
        topic: "Jumping into AI/ML",
        advice:
            "Build from first principles but don't get into analysis paralysis. Linear algebra, probability, Python. Get your hands dirty instead of only watching tutorials.",
        tags: ["ml", "math", "portfolio"],
        details:
            "Pick one benchmark dataset and set a clear goal (e.g., match paper accuracy). Keep an experiment log, control variables, and visualize failures. Focus on data quality and evaluation before adding model complexity.",
    },
    {
        id: "3",
        date: "2025-10-29",
        likes: 3,
        dislikes: 0,
        title: "Product Manager",
        company: "Atlassian",
        topic: "Communicating impact",
        advice:
            "Frame your work as outcomes, not tasks. What changed for users or the business because of your contribution?",
        tags: ["interviews", "communication", "impact"],
        details:
            "Convert tasks to metrics: latency reduced by 30%, support tickets down 15%, conversion up 3%. Include the measurement window and confidence. Use before/after visuals where possible.",
    },
    {
        id: "4",
        date: "2025-10-29",
        likes: 2,
        dislikes: 0,
        title: "Site Reliability Engineer",
        company: "Cloudflare",
        topic: "Systems and reliability",
        advice:
            "Learn to read dashboards and logs. Start with the simplest hypothesis and verify with data before changing anything.",
        tags: ["sre", "observability", "debugging"],
        details:
            "Build a personal debugging checklist: check status pages, recent deploys, error budgets, and top alerts. Use bisecting and correlation—avoid changing multiple variables at once.",
    },
    {
        id: "5",
        date: "2025-10-26",
        likes: 4,
        dislikes: 0,
        title: "Frontend Engineer",
        company: "Figma",
        topic: "Frontend craftsmanship",
        advice:
            "get really good at state management. performance is highkey a UX feature, so keep it sharp.",
        tags: ["frontend", "a11y", "performance"],
        details:
            "Adopt an accessibility-first mindset: semantic HTML, focus states, and color contrast. Measure with Lighthouse and the Performance panel. Prefer simple state over complex abstractions.",
    },
    {
        id: "6",
        date: "2025-10-26",
        likes: 2,
        dislikes: 1,
        title: "Design Engineer",
        company: "Windsurf",
        topic: "Maximizing your internships",
        advice:
            "If you want to find what you love, aim for high breadth across internships, and high depth within each internship.",
        tags: ["jobs", "career"],
        details:
            "Return actionable error messages with machine-readable codes. Document idempotency and rate limits. Add request IDs and structured logs to speed up incident response.",
    },
];

export default function AdvicePage() {
    const router = useRouter();
    const { isAdmin, authIsLoading } = useAuth();
    const [votes, setVotes] = useState<Record<string, { likes: number; dislikes: number; choice: "like" | "dislike" | null }>>(() => {
        const initial: Record<string, { likes: number; dislikes: number; choice: "like" | "dislike" | null }> = {};
        interviews.forEach((i) => {
            initial[i.id] = { likes: i.likes ?? 0, dislikes: i.dislikes ?? 0, choice: null };
        });
        return initial;
    });

    useEffect(() => {
        if (!authIsLoading && !isAdmin()) {
            router.push('/');
        }
    }, [authIsLoading, isAdmin, router]);

    function handleLike(id: string) {
        setVotes((prev) => {
            const cur = prev[id];
            const next = { ...prev };
            if (cur.choice === "like") {
                next[id] = { ...cur, likes: Math.max(0, cur.likes - 1), choice: null };
            } else if (cur.choice === "dislike") {
                next[id] = { ...cur, dislikes: Math.max(0, cur.dislikes - 1), likes: cur.likes + 1, choice: "like" };
            } else {
                next[id] = { ...cur, likes: cur.likes + 1, choice: "like" };
            }
            return next;
        });
    }

    function handleDislike(id: string) {
        setVotes((prev) => {
            const cur = prev[id];
            const next = { ...prev };
            if (cur.choice === "dislike") {
                next[id] = { ...cur, dislikes: Math.max(0, cur.dislikes - 1), choice: null };
            } else if (cur.choice === "like") {
                next[id] = { ...cur, likes: Math.max(0, cur.likes - 1), dislikes: cur.dislikes + 1, choice: "dislike" };
            } else {
                next[id] = { ...cur, dislikes: cur.dislikes + 1, choice: "dislike" };
            }
            return next;
        });
    }

    if (authIsLoading || !isAdmin()) {
        return <Skeleton className="w-12 h-9 bg-zinc-100 dark:bg-muted" />;
    }

    return (
        <div className="flex flex-col gap-6 py-3">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">Career Advice</h1>
                <p className="text-muted-foreground">
                    Curated insights from cracked Waterloo graduates to help you plan your next step.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {interviews.map((item) => (
                    <Dialog key={item.id}>
                        <DialogTrigger asChild>
                            <Card className="h-full flex flex-col cursor-pointer transition hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <CardTitle className="truncate">{item.topic}</CardTitle>
                                            <CardDescription className="truncate">
                                                {item.title} @ {item.company}
                                            </CardDescription>
                                        </div>
                                        <div className="hidden sm:flex gap-1 flex-wrap justify-end">
                                            {item.tags.slice(0, 1).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="whitespace-nowrap">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 flex-1">
                                    <p className="text-sm leading-relaxed">
                                        “{item.advice}”
                                    </p>
                                    <div className="mt-3 flex gap-2 sm:hidden">
                                        {item.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span aria-hidden><ThumbsUp size={20} /></span>
                                                <span>{votes[item.id]?.likes ?? 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span aria-hidden><ThumbsDown size={20} /></span>
                                                <span>{votes[item.id]?.dislikes ?? 0}</span>
                                            </div>
                                        </div>
                                        <time className="text-xs text-muted-foreground" dateTime={item.date}>
                                            {item.date}
                                        </time>
                                    </div>
                                </CardFooter>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{item.topic}</DialogTitle>
                                <DialogDescription>
                                    {item.title} @ {item.company}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <p className="text-sm leading-relaxed">
                                    {item.details ?? item.advice}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {item.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <Button
                                        variant={votes[item.id]?.choice === "like" ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => handleLike(item.id)}
                                        aria-pressed={votes[item.id]?.choice === "like"}
                                    >
                                        <span className="mr-2"><ThumbsUp size={20} /></span>
                                        <span className="text-sm">{votes[item.id]?.likes ?? 0}</span>
                                    </Button>

                                    <Button
                                        variant={votes[item.id]?.choice === "dislike" ? "destructive" : "ghost"}
                                        size="sm"
                                        onClick={() => handleDislike(item.id)}
                                        aria-pressed={votes[item.id]?.choice === "dislike"}
                                    >
                                        <span className="mr-2"><ThumbsDown size={20} /></span>
                                        <span className="text-sm">{votes[item.id]?.dislikes ?? 0}</span>
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
}


