"use client"

import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown, Star, MessageSquare } from 'lucide-react';

function DiscussionDropdown({selectedDiscussionType, setDiscussionType} : any) {
    const handleDropdownChange: any = (value: any) => {
        setDiscussionType(value)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className='flex flex-row justify-between h-10 text-xl font-bold text-foreground text-right'>
                {selectedDiscussionType}<ChevronDown/>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup value={selectedDiscussionType} onValueChange={handleDropdownChange}>
                    <DropdownMenuRadioItem value="Advice" key="advice" className="text-left">
                    Advice
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Ratings" key="ratings" className="text-left">
                    Ratings
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )}

    export { DiscussionDropdown }