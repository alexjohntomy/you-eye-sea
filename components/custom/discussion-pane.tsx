"use client";

import { DiscussionDropdown } from "@/components/custom/discussion-dropdown";
import { useState } from "react";

function DiscussionPane({
  commentPaneServerComponent,
  reviewPaneServerComponent,
}: any) {
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
