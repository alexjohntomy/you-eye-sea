"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";

interface DiscussionDropdownProps {
  selectedDiscussionType: string;
  setDiscussionType: (value: string) => void;
}

function DiscussionDropdown({
  selectedDiscussionType,
  setDiscussionType,
}: DiscussionDropdownProps) {
  const handleDropdownChange = (value: string) => {
    setDiscussionType(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-row justify-center indent-2 gap-1 h-10 w-full text-xl font-bold text-foreground text-center"
        >
          {selectedDiscussionType}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuRadioGroup
          value={selectedDiscussionType}
          onValueChange={handleDropdownChange}
        >
          <DropdownMenuRadioItem
            value="Ratings"
            key="ratings"
            className="text-left"
          >
            Ratings
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Advice"
            key="advice"
            className="text-left"
          >
            Advice
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DiscussionDropdown };
