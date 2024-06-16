import React from "react";
import { Bot, ContactRoundIcon, DollarSign, Minus } from "lucide-react"; // Import specific icons
import { Status } from "@/app/jobs/status";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface StepperProps {
	steps: Status[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
	const currentStep = steps.length - 1; // Always set to the last step

	// Define fixed icons for the first and last steps
	const preAssessmentIcon = Bot;
	const offerCallIcon = DollarSign;

	// Define an icon to use for the middle steps
	const interviewIcon = ContactRoundIcon;
    
	return (
		<div>
			<div className="flex">
				{steps.map((step, index) => {
					let IconComponent;
					if (step.name === "OA") {
						IconComponent = preAssessmentIcon;
					} else if (step.name === "Offer") {
						IconComponent = offerCallIcon;
					} else {
						IconComponent = interviewIcon;
					}

					return (
						<div>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<div key={index} className="flex items-center">
											<div
												className={`flex items-center justify-center w-8 h-8 rounded-full ${
													index === currentStep ? "bg-primary/80 " : "bg-transparent outline outline-primary/80"
												} ${index < currentStep ? "opacity-75" : ""}`}
											>
												<IconComponent className={`w-4 h-4 ${index === currentStep ? "text-black" : ""}`} strokeWidth={2} />{" "}
												{/* Render the icon */}
											</div>
											{index < steps.length - 1 && (
												<div className="flex-auto">
													&mdash;
												</div>
											)}
										</div>
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
