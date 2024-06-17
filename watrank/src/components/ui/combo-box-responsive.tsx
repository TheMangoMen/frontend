"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Stage = {
  value: string
  label: string
}

const statuses: Stage[] = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "Online Assessment",
    label: "OA",
  },
  {
    value: "Interview 1",
    label: "Interview 1",
  },
  {
    value: "Interview 2",
    label: "Interview 2",
  },
  {
    value: "Interview 3",
    label: "Interview 3",
  },
  {
    value: "Offer Call",
    label: "Offer Call",
  },
]

interface ComboBoxResponsiveProps {
  jID: number
}

export function ComboBoxResponsive({jID}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Stage | null>(null)

  const handleSubmit = async () => {
    
    const data = {
      jID: "j12cole",
      status: selectedStatus
    };

    

    try {
      const response = await fetch("http://localhost:8080/contribution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
     // const response = await fetch(`http://localhost:8080/jobs?uID=j12cole`);
  
      // Handle success
      alert("Status submitted successfully!");
    } catch (error) {
      // Handle error
      console.error(error);
      alert("Error submitting status");
    }
  }


    return (
      <div>
        <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set your status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput className="flex" placeholder="Filter status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={() => setSelectedStatus(status)}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
        <Button onClick={handleSubmit} className="group relative inline-flex items-center justify-start overflow-hidden rounded border-1 border-primary bg-background px-5 py-3 transition-all text-center hover:bg-transparent">
          <span className="absolute inset-0 rounded border-0 border-background transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
          <span className="relative w-full text-center text-black dark:text-white transition-colors duration-200 ease-in-out group-hover:text-primary">Submit</span>
        </Button>
      </div>
    )
}
