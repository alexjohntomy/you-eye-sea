"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DiscussionPaneProps {
  commentPaneServerComponent: React.ReactNode;
  reviewPaneServerComponent: React.ReactNode;
}

function DiscussionPane({
  commentPaneServerComponent,
  reviewPaneServerComponent,
}: DiscussionPaneProps) {
  const [selectedTab, setSelectedTab] = useState("ratings");

  return (
    <Tabs
      defaultValue="ratings"
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="-mt-1 flex h-full w-full flex-col"
    >
      <TabsList className="bg-muted/50 border-foreground/10 h-auto w-full gap-0.5 md:gap-1 rounded-xl border p-1 md:p-1.5 shadow-none">
        <TabsTrigger
          value="ratings"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground flex-1 rounded-lg border border-transparent py-1 px-1 md:px-2 text-xs lg:text-sm font-bold transition-all hover:text-foreground/80 data-[state=active]:border-foreground/10 data-[state=active]:shadow-none"
        >
          Ratings
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground flex-1 rounded-lg border border-transparent py-1 px-1 md:px-2 text-xs lg:text-sm font-bold transition-all hover:text-foreground/80 data-[state=active]:border-foreground/10 data-[state=active]:shadow-none"
        >
          Notes
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="ratings"
        className="h-full min-h-full flex-1 flex-col outline-none data-[state=active]:flex"
      >
        {reviewPaneServerComponent}
      </TabsContent>
      <TabsContent
        value="notes"
        className="h-full min-h-full flex-1 flex-col outline-none data-[state=active]:flex"
      >
        {commentPaneServerComponent}
      </TabsContent>
    </Tabs>
  );
}

export { DiscussionPane };
