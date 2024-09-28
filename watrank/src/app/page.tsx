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
import { ArrowRight, Heart } from "lucide-react";
import { Footer } from "@/components/footer";
import { useAuth } from "@/context/AuthContext";

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
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`);
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
			<div ref={rankerSVGRef} className="hidden absolute w-12 opacity-40">
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
					<h1 className="text-3xl font-extrabold">
						Meet
						<div className="text-7xl lg:text-8xl">
							<span className="font-medium">Wat</span>
							<span className="font-black">Rank</span>
						</div>
					</h1>
					<p className="text-2xl my-6">Navigate co-op with confidence.</p>

					<Link href={nextpage} passHref>
						<button className="bg-primary hover:bg-primary/90 text-black text-xl font-semibold px-6 py-2 rounded-xl hover:shadow-md dark:shadow-secondary-foreground">
							Get started <ArrowRight className="inline" />
						</button>
					</Link>
				</div>

				<div className="lg:w-full bg-black text-white p-4 rounded border border-gold font-mono flex flex-col shadow-stats">
					<h2 className="text-2xl flex items-center">
						<span className="w-3 h-3 bg-red-500 rounded-full ml-2 mr-6 shadow-red"></span>
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
						<div className="bg-secondary p-2 flex justify-left text-secondary-foreground font-medium text-center">
							<span className="w-14">OA</span>
							<span className="w-20">Interview</span>
							<span className="w-14">Offer</span>
							<span className="ml-6">Company</span>
						</div>

						<div className="p-2 flex justify-left">
							<div className="w-14 flex justify-center">
								<div className="bg-gold/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-yellow dark:text-yellow-200 font-bold">
										42
									</span>
								</div>
							</div>

							<div className="w-20 flex justify-center">
								<div className="bg-[#72eb45]/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-green dark:text-green-200 font-bold">
										2
									</span>
								</div>
							</div>

							<div className="w-14 flex justify-center">
								<div className="bg-[#269df3]/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-blue dark:text-blue-200 font-bold">
										23
									</span>
								</div>
							</div>

							<div className="ml-6">
								<p className="font-semibold">Apple</p>
								<p className="text-sm text-secondary-foreground">
									Software Engineering Intern
								</p>
							</div>
						</div>

						<div className="p-2 flex justify-left">
							<div className="w-14 flex justify-center">
								<div className="bg-gold/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-yellow dark:text-yellow-200 font-bold">
										42
									</span>
								</div>
							</div>

							<div className="w-20 flex justify-center">
								<div className="bg-[#72eb45]/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-green dark:text-green-200 font-bold">
										2
									</span>
								</div>
							</div>

							<div className="w-14 flex justify-center">
								<div className="bg-[#269df3]/50 w-10 h-10 rounded-lg flex items-center justify-center">
									<span className="text-dark-blue dark:text-blue-200 font-bold">
										23
									</span>
								</div>
							</div>

							<div className="ml-6">
								<p className="font-semibold">Google</p>
								<p className="text-sm text-secondary-foreground">
									Software Engineering Intern
								</p>
							</div>
						</div>

						<div className="p-2 flex justify-left bg-soft-yellow dark:bg-dark-grey">
							<div className="w-14 flex justify-center items-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M20 6L9 17L4 12"
										stroke="#22C55E"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>

							<div className="w-20 flex justify-center items-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18"
										stroke="#EF4444"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M6 6L18 18"
										stroke="#EF4444"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>

							<div className="w-14 flex justify-center items-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18"
										stroke="#EF4444"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M6 6L18 18"
										stroke="#EF4444"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>

							<div className="ml-6 text-sm text-secondary-foreground italic">
								<p className="font-semibold">Anonymous User</p>
								<p>on Sept. 22</p>
							</div>
						</div>

						<div className="p-2 flex justify-left bg-soft-yellow dark:bg-black/20">
							<div className="w-14 flex justify-center items-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M20 6L9 17L4 12"
										stroke="#22C55E"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>

							<div className="w-20 flex justify-center items-center">
								<p className="text-dark-green dark:text-green-200 font-bold">
									#2
								</p>
							</div>

							<div className="w-14 flex justify-center items-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M20 6L9 17L4 12"
										stroke="#22C55E"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>

							<div className="ml-6 text-sm text-secondary-foreground italic">
								<p className="font-semibold">Anonymous User</p>
								<p>on Sept. 22</p>
							</div>
						</div>
					</div>
					<h2 className="text-3xl font-bold text-center pb-1 mt-8">
						Interviews
					</h2>
					<p className="text-xl text-secondary-foreground text-center">
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
					<h2 className="text-3xl font-bold text-center pb-1 mt-8">Rankings</h2>
					<p className="text-xl text-secondary-foreground text-center">
						Let others know if you&apos;re taking a job.
					</p>
				</div>

				<div className="p-4 lg:p-10 border-med-grey lg:border-r border-b">
					<div className="h-[276px] w-[276px] bg-secondary rounded-lg mx-auto relative border border-med-grey shadow-xl flex items-center justify-center">
						<Heart
							ref={heartSVGRef}
							className="stroke-red-500 drop-shadow-[0_0_3px_red] w-28 h-28"
						/>
					</div>
					<h2 className="text-3xl font-bold text-center pb-1 mt-8">
						Contribute
					</h2>
					<p className="text-xl text-secondary-foreground text-center">
						To the success of your peers.
					</p>
				</div>

				<div className="p-4 lg:p-10 border-med-grey border-b">
					<div
						id="analytics-graph"
						ref={analyticsRef}
						className="max-w-lg h-[276px] mx-auto rounded-lg border border-med-grey shadow-xl bg-secondary"
					>
						<div className="flex justify-around h-full p-6">
							<div className="w-10 h-5/6 bg-[#ffd942] self-end"></div>
							<div className="w-10 h-1/2 bg-[#aeff90] self-end"></div>
							<div className="w-10 h-1/6 bg-[#7cc8ff] self-end"></div>
						</div>
					</div>
					<h2 className="text-3xl font-bold text-center pb-1 mt-8">
						Analytics
					</h2>
					<p className="text-xl text-secondary-foreground text-center">
						See how you&apos;ve grown!
					</p>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default LandingPage;
