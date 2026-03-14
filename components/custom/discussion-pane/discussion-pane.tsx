"use client";

import { DiscussionDropdown } from "@/components/custom/discussion-pane/discussion-dropdown";
import { useState } from "react";

interface DiscussionPaneProps {
  commentPaneServerComponent: React.ReactNode;
  reviewPaneServerComponent: React.ReactNode;
}

function DiscussionPane({
  commentPaneServerComponent,
  reviewPaneServerComponent,
}: DiscussionPaneProps) {
  const [selectedDiscussionType, setDiscussionType] = useState("Ratings");
  if (selectedDiscussionType === "Advice") {
    return (
      <>
        <DiscussionDropdown
          selectedDiscussionType={selectedDiscussionType}
          setDiscussionType={setDiscussionType}
        ></DiscussionDropdown>
        {commentPaneServerComponent}
      </>
    );
  } else {
    return (
      <>
        <DiscussionDropdown
          selectedDiscussionType={selectedDiscussionType}
          setDiscussionType={setDiscussionType}
        ></DiscussionDropdown>
        {reviewPaneServerComponent}
      </>
    );
  }
}

export { DiscussionPane };
