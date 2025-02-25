import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type FilterOption = "all" | "inProgress" | "pending";

interface AnimatedTabsProps {
    setTabFilter: (tab: FilterOption) => void;
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ setTabFilter }) => {
    const [activeTab, setActiveTab] = useState<FilterOption>("all");
    const [hoveredTab, setHoveredTab] = useState<FilterOption | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const tabs: { label: string; value: FilterOption }[] = [
        { label: "All", value: "all" },
        { label: "In Progress", value: "inProgress" },
        { label: "Pending", value: "pending" },
    ];

    const handleTabChange = (option: FilterOption) => {
        setActiveTab(option);
        setTabFilter(option);
    };

    return (
        <div ref={containerRef} className="relative flex rounded-lg gap-2">
            {tabs.map((tab) => (
                <Button
                    key={tab.value}
                    variant="ghost"
                    className={`relative z-10 transition-colors duration-50 px-2 text-muted-foreground hover:bg-primary/30 ${
                        activeTab === tab.value
                            ? "bg-primary/50 text-foreground"
                            : ""
                    }`}
                    onClick={() => handleTabChange(tab.value)}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
};

export default AnimatedTabs;
