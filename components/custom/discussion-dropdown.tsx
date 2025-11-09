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
            <Button variant="ghost" className='flex flex-row justify-center indent-2 gap-1 h-10 w-full text-xl font-bold text-foreground text-center'>
                {selectedDiscussionType}<ChevronDown/>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup value={selectedDiscussionType} onValueChange={handleDropdownChange}>
                    <DropdownMenuRadioItem value="Ratings" key="ratings" className="text-left">
                    Ratings
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Advice" key="advice" className="text-left">
                    Advice
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )}

    export { DiscussionDropdown }