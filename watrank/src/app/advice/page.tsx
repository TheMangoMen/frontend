import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Interview = {
    id: string;
    name: string;
    title: string;
    company: string;
    topic: string;
    advice: string;
    tags: string[];
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
                    <Card key={item.id} className="h-full">
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
                ))}
            </div>
        </div>
    );
}


