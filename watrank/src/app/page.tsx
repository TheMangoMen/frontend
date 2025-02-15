"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
    animateHeart,
    animateRankers,
    animateRankings,
    animateContributions,
    animateAnalytics,
} from "@/animations/landing";
import { ArrowRight, CheckIcon, Heart, XIcon } from "lucide-react";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
    InterviewCountCell,
    OACountCell,
    OfferCountCell,
} from "./jobs/table-shared/count-cell";
import {
    InterviewRound,
    OACheck,
    OfferCheck,
} from "./jobs/table-shared/expanded-count-cell";
import { formatDate } from "@/utils/utils";
import Banner from "@/components/banner";
import confetti from "canvas-confetti";

const LandingPage = () => {
    const { isLoggedIn } = useAuth();

    // create a ref and declare an instance for each countUp animation
    const usersRef = useRef<HTMLParagraphElement>(null);
    const contributionsRef = useRef<HTMLParagraphElement>(null);
    const heartSVGRef = useRef<SVGSVGElement>(null);
    const rankerRef = useRef<HTMLDivElement>(null);
    const rankerSVGRef = useRef<HTMLDivElement>(null);
    const rankingsRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const contributionsTableRef = useRef<HTMLDivElement>(null);
    const analyticsRef = useRef<HTMLDivElement>(null);
    const theChosenOne = useRef<SVGSVGElement>(null);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/stats`
            );
            const data = await response.json();
            initCountUp(usersRef, data.num_users);
            initCountUp(contributionsRef, data.num_contributions);
        };

        fetchData();
        try {
            animateHeart(heartSVGRef.current);
            animateRankers(rankerRef.current, rankerSVGRef.current);
            animateRankings(
                rankingsRef.current,
                theChosenOne.current,
                lineRef.current
            );
            animateContributions(contributionsTableRef.current);
            animateAnalytics(analyticsRef.current);
        } catch {}

        // Add snow animation
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const SNOW_CHANCE = 0.1; // Lower = fewer snowflakes
        const SNOW_SIZE = 1.5; // Adjust size of snowflakes
        let skew = 1;

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const snowflakes = ["❄"].map((text) =>
            confetti.shapeFromText({ text, scalar: SNOW_SIZE })
        );

        function makeItSnow() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));
            skew = Math.max(0.8, skew - 0.001);

            if (Math.random() < SNOW_CHANCE) {
                confetti({
                    particleCount: 1,
                    startVelocity: 0,
                    ticks: ticks,
                    origin: {
                        x: Math.random(),
                        y: Math.random() * skew - 0.2,
                    },
                    colors: ["#89CFF0", "#ADD8E6", "#B0E0E6"],
                    shapes: snowflakes,
                    scalar: SNOW_SIZE,
                    gravity: randomInRange(0.3, 0.5),
                    drift: randomInRange(-0.4, 0.4),
                });
            }

            if (timeLeft > 0) {
                requestAnimationFrame(makeItSnow);
            }
        }

        makeItSnow();
    }, []);

    // dynamically import and initialize countUp, sets value of `countUpAnim`
    // you don't have to import this way, but this works best for next.js
    let countUpAnim;
    async function initCountUp(ref: React.RefObject<HTMLElement>, num: number) {
        const countUpModule = await import("countup.js");
        if (ref.current) {
            // Check if current is not null
            countUpAnim = new countUpModule.CountUp(ref.current, num);
            if (!countUpAnim.error) {
                countUpAnim.start();
            } else {
                console.error(countUpAnim.error);
            }
        }
    }

    const nextpage = isLoggedIn() ? "/jobs" : "/login";

    return (
        <>
            <div
                ref={rankerSVGRef}
                className="hidden absolute w-12 -z-10 opacity-40"
            >
                <svg
                    viewBox="0 0 298 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M127 9.07969C139.106 -3.02656 158.734 -3.02656 170.841 9.07969L297.841 136.08L254 179.92L148.92 74.8406L43.8406 179.92L0 136.08L127 9.07969Z"
                        fill="#FACC14"
                    />
                </svg>
            </div>
            <div
                className="absolute origin-left border-2 rounded-full hidden"
                ref={lineRef}
            />
            <section
                ref={rankerRef}
                id="ranker-container"
                className="relative py-12 lg:py-24 max-w-6xl px-4 lg:px-8 h-screen grid lg:grid-cols-2 mx-auto content-center lg:items-center justify-center gap-y-8 -mb-6"
            >
                <div className="mb-8 lg:mb-0">
                    {/* <div className="flex justify-center lg:justify-start">
						<Banner />
					</div> */}
                    <h1 className="text-3xl font-extrabold">
                        Meet
                        <div className="text-7xl lg:text-8xl">
                            <span className="font-medium">Wat</span>
                            <span className="font-black">Rank</span>
                        </div>
                    </h1>
                    <p className="text-xl lg:text-2xl my-6">
                        Navigate co-op with confidence.
                    </p>

                    <Link href={nextpage} passHref>
                        <button className="bg-primary hover:bg-primary/90 text-black text-xl font-semibold px-6 py-2 rounded-xl hover:shadow-md dark:shadow-secondary-foreground">
                            Get started <ArrowRight className="inline" />
                        </button>
                    </Link>
                </div>

                <div className="lg:w-full bg-black text-white p-4 rounded border border-gold font-mono flex flex-col shadow-stats">
                    <h2 className="text-2xl flex items-center">
                        <span className="w-5 h-5 bg-red-500 rounded-full ml-2 mr-6 opacity-55 absolute inline-flex animate-ping shadow-red"></span>
                        <span className="w-3 h-3 bg-red-500 rounded-full ml-3 mr-6 shadow-red"></span>
                        Live Stats
                    </h2>

                    <div className="justify-around h-full grid grid-cols-2 items-center py-8 lg:py-14 sm:px-10">
                        <div className="text-center">
                            <p
                                className="text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-green-300"
                                ref={usersRef}
                            >
                                0
                            </p>
                            <p className="text-xl">users</p>
                        </div>
                        <div className="text-center">
                            <p
                                className="text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-fuchsia-500"
                                ref={contributionsRef}
                            >
                                0
                            </p>
                            <p className="text-xl">contributions</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full h-2 bg-gradient-to-r from-yellow-200 to-green-300"></div>

            <div className="snap-none grid lg:grid-cols-2 ">
                <div className="py-8 px-4 lg:p-10 border-b border-med-grey lg:border-r">
                    <div
                        id="contributions-table"
                        ref={contributionsTableRef}
                        className="max-w-lg mx-auto bg-secondary rounded-lg border border-med-grey overflow-hidden shadow-xl divide-y divide-med-grey"
                    >
                        <RowLayout className="bg-background">
                            <span>OA</span>
                            <span>Interview</span>
                            <span>Offer</span>
                            <span className="ml-6 text-left">Job</span>
                        </RowLayout>
                        <JobEntryMain
                            OAs={42}
                            interviews={2}
                            offers={1}
                            company="Apple"
                            title="Software Engineer"
                        />
                        <JobEntryExpanded
                            gotOA={true}
                            interviewRound={2}
                            gotOffer={true}
                            user="Anonymous"
                            date={formatDate(new Date())}
                        />
                        <JobEntryExpanded
                            gotOA={true}
                            interviewRound={1}
                            gotOffer={false}
                            user="Anonymous"
                            date={formatDate(new Date(Date.now() - 86400000))}
                        />
                        <JobEntryMain
                            OAs={2}
                            interviews={0}
                            offers={0}
                            company="Deloitte"
                            title="Junior Accountant"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-center pb-1 mt-8">
                        Interviews
                    </h2>
                    <p className="text-lg lg:text-xl text-secondary-foreground text-center">
                        Get updates for jobs you&apos;ve applied to.
                    </p>
                </div>

                <div className="py-8 px-4 lg:p-10 border-med-grey border-b">
                    <div
                        id="the-canvas"
                        ref={rankingsRef}
                        className="h-[276px] w-[276px] bg-secondary rounded-lg mx-auto relative border border-med-grey shadow-xl"
                    >
                        <svg
                            ref={theChosenOne}
                            viewBox="0 0 298 180"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-0 bottom-0 -m-4 w-8 h-8 hidden"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M127 9.07969C139.106 -3.02656 158.734 -3.02656 170.841 9.07969L297.841 136.08L254 179.92L148.92 74.8406L43.8406 179.92L0 136.08L127 9.07969Z"
                                fill="gold"
                            ></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-center pb-1 mt-8">
                        Rankings
                    </h2>
                    <p className="text-lg lg:text-xl text-secondary-foreground text-center">
                        Let others know if you&apos;re taking a job.
                    </p>
                </div>
            </div>
            <FAQ />
            <Footer />
        </>
    );
};

export default LandingPage;

function RowLayout({
    children,
    className,
}: {
    children: React.ReactNode[];
    className?: string;
}) {
    return (
        <div className={cn("p-2 flex flex-row justify-left", className)}>
            <div className="w-14 shrink-0 flex justify-center">
                {children[0]}
            </div>
            <div className="w-20 shrink-0 flex justify-center">
                {children[1]}
            </div>
            <div className="w-14 shrink-0 flex justify-center">
                {children[2]}
            </div>
            {children[3]}
        </div>
    );
}

function JobEntryMain({
    OAs,
    interviews,
    offers,
    company,
    title,
}: {
    OAs: number;
    interviews: number;
    offers: number;
    company: string;
    title: string;
}) {
    return (
        <RowLayout>
            <OACountCell value={OAs} />
            <InterviewCountCell value={interviews} />
            <OfferCountCell value={offers} />
            <div className="ml-6">
                <p className="font-semibold">{company}</p>
                <p className="text-xs lg:text-sm text-secondary-foreground">
                    {title}
                </p>
            </div>
        </RowLayout>
    );
}

function JobEntryExpanded({
    gotOA,
    interviewRound,
    gotOffer,
    user,
    date,
}: {
    gotOA: boolean;
    interviewRound: number;
    gotOffer: boolean;
    user: string;
    date: string;
}) {
    return (
        <RowLayout className="p-2 flex justify-left items-center bg-soft-yellow dark:bg-black/20">
            {gotOA && <OACheck />}
            {interviewRound && <InterviewRound round={interviewRound} />}
            {gotOffer && <OfferCheck />}
            <div className="ml-6 text-sm text-secondary-foreground italic">
                <p className="font-semibold">{user}</p>
                <p>on {date}</p>
            </div>
        </RowLayout>
    );
}
