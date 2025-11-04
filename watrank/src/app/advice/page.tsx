import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Interview = {
    id: string;
    name: string;
    title: string;
    company: string;
    topic: string;
    advice: string;
    tags: string[];
    details?: string;
};

const interviews: Interview[] = [
    {
        id: "1",
        name: "Ava Thompson",
        title: "Senior Software Engineer",
        company: "Shopify",
        topic: "Finding your first co-op",
        advice:
            "Treat each application as practice. Keep your resume short, quantify impact, and ship small projects you can demo in 2 minutes.",
        tags: ["resume", "projects", "interviews"],
        details:
            "Start with a simple, well-scoped project that solves a real problem for you or a friend. Write a concise README that explains the problem, approach, and trade-offs. When interviewing, walk through your decision tree: why this stack, how you tested, and what you'd improve with more time.",
    },
    {
        id: "2",
        name: "Daniel Kim",
        title: "Machine Learning Engineer",
        company: "NVIDIA",
        topic: "Jumping into AI/ML",
        advice:
            "Build from first principles: linear algebra, probability, and Python. Reproduce a paper end-to-end instead of only watching tutorials.",
        tags: ["ml", "math", "portfolio"],
        details:
            "Pick one benchmark dataset and set a clear goal (e.g., match paper accuracy). Keep an experiment log, control variables, and visualize failures. Focus on data quality and evaluation before adding model complexity.",
    },
    {
        id: "3",
        name: "Maya Patel",
        title: "Product Manager",
        company: "Atlassian",
        topic: "Communicating impact",
        advice:
            "Frame your work as outcomes, not tasks. What changed for users or the business because of your contribution?",
        tags: ["communication", "impact"],
        details:
            "Convert tasks to metrics: latency reduced by 30%, support tickets down 15%, conversion up 3%. Include the measurement window and confidence. Use before/after visuals where possible.",
    },
    {
        id: "4",
        name: "Leo García",
        title: "Site Reliability Engineer",
        company: "Cloudflare",
        topic: "Systems and reliability",
        advice:
            "Learn to read dashboards and logs calmly. Start with the simplest hypothesis and verify with data before changing anything.",
        tags: ["sre", "observability", "debugging"],
        details:
            "Build a personal debugging checklist: check status pages, recent deploys, error budgets, and top alerts. Use bisecting and correlation—avoid changing multiple variables at once.",
    },
    {
        id: "5",
        name: "Sofia Rossi",
        title: "Frontend Engineer",
        company: "Figma",
        topic: "Frontend craftsmanship",
        advice:
            "Master the fundamentals: DOM, accessibility, and state management. Performance is a UX feature—profile early and often.",
        tags: ["frontend", "a11y", "performance"],
        details:
            "Adopt an accessibility-first mindset: semantic HTML, focus states, and color contrast. Measure with Lighthouse and the Performance panel. Prefer simple state over complex abstractions.",
    },
    {
        id: "6",
        name: "Noah Williams",
        title: "Backend Engineer",
        company: "Stripe",
        topic: "APIs that age well",
        advice:
            "Design for clarity and evolution. Strong contracts, good errors, idempotency, and observability save future you.",
        tags: ["api", "design", "backend"],
        details:
            "Return actionable error messages with machine-readable codes. Document idempotency and rate limits. Add request IDs and structured logs to speed up incident response.",
    },
];

export default function AdvicePage() {
    return (
        <div className="flex flex-col gap-6">
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
                            <Card className="h-full cursor-pointer transition hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <CardTitle className="truncate">{item.topic}</CardTitle>
                                            <CardDescription className="truncate">
                                                {item.name} · {item.title} @ {item.company}
                                            </CardDescription>
                                        </div>
                                        <div className="hidden sm:flex gap-1 flex-wrap justify-end">
                                            {item.tags.slice(0, 2).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="whitespace-nowrap">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
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
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{item.topic}</DialogTitle>
                                <DialogDescription>
                                    {item.name} · {item.title} @ {item.company}
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
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
}


