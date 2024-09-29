import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

type FilterOption = 'all' | 'inProgress' | 'pending';

interface AnimatedTabsProps {
    setTabFilter: (tab: FilterOption) => void;
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ setTabFilter }) => {
  const [activeTab, setActiveTab] = useState<FilterOption>('all');
  const [hoveredTab, setHoveredTab] = useState<FilterOption | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs: { label: string; value: FilterOption }[] = [
    { label: 'All', value: 'all' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Pending', value: 'pending' },
  ];

  const handleTabChange = (option: FilterOption) => {
    setActiveTab(option);
    setTabFilter(option);
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex bg-muted dark:bg-background rounded-lg gap-2"

    >
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant="ghost"
          className={`relative z-10 transition-colors  duration-200 px-2${
            activeTab === tab.value ? 'bg-primary text-primary' : 'text-muted-foreground dark:text-muted-foreground'
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