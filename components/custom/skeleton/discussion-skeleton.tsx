function DiscussionSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="bg-muted/50 border-foreground/10 mt-1 flex w-full gap-0.5 md:gap-1 rounded-xl border p-1 md:p-1.5">
        <div className="shimmer h-8.5 flex-1 rounded-lg" />
        <div className="shimmer h-8.5 flex-1 rounded-lg" />
      </div>
      <div className="shimmer w-full flex-1 rounded-md" />
      <div>
        <div className="shimmer h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

export { DiscussionSkeleton };
