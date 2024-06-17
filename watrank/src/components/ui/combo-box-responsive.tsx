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


interface ComboBoxResponsiveProps {
    jID: number
}

export function ComboBoxResponsive({ jID }: ComboBoxResponsiveProps) {
    const [open, setOpen] = React.useState(false)


    return (
        <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
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
            </div>

            <div className="flex flex-col space-y-1.5">
                <Button onClick={handleSubmit} variant={"outline"} className="right-0">
                    Submit
                </Button>
            </div>
        </div>
    )
}
