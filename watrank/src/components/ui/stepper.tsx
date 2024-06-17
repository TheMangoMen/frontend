import React from "react";
import { Bot, ContactRoundIcon, DollarSign, Minus, ListOrdered, Ban, Trophy } from "lucide-react"; // Import specific icons
import { Status } from "@/app/jobs/status";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface StepperProps {
	steps: Status[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
	const currentStep = steps ? steps.length - 1 : 0; // Always set to the last step

	// Define fixed icons for the first and last steps
	const preAssessmentIcon = Bot;
	const offerCallIcon = DollarSign;

	// Define an icon to use for the middle steps
	const interviewIcon = ContactRoundIcon;

	const takingIcon = Trophy;
	const notTakingIcon = Ban;
	const rankedIcon = ListOrdered;

	const iconMap = {
		"OA": preAssessmentIcon,
		"Offer Call": offerCallIcon,
		"Interview": interviewIcon,
		"Ranked": rankedIcon,
		"Taking": takingIcon,
		"Not Taking": notTakingIcon,
	}
    
	return (
		<div>
			<div className="flex">
				{steps?.map((step, index) => {
					let IconComponent;
					if (step.name in iconMap) {
						IconComponent = iconMap[step.name]
					}
					else {
						IconComponent = iconMap["Interview"]
					}

					return (
						<div key={index}>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<div className="flex items-center">
											{index > 0 && (
												<div className="flex-auto">
													&ndash;
												</div>
											)}
											<div
												className={`flex items-center justify-center w-8 h-8 rounded-full ${
													index === currentStep ? "bg-primary/80 " : "bg-transparent outline outline-primary/80"
												} ${index < currentStep ? "opacity-75" : ""}`}
											>
												<IconComponent className={`w-4 h-4 ${index === currentStep ? "text-black" : ""}`} strokeWidth={2} />{" "}
											</div>
											{index < steps.length - 1 && (
												<div className="flex-auto">
													&ndash;
												</div>
											)}
										</div>
										{["Ranked", "Taking", "Not Taking"].includes(step.name) && <p>{step.count}</p>}
									</TooltipTrigger>
									<TooltipContent>
										<div className="text-sm">{step.name}: {step.count}</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Stepper;
