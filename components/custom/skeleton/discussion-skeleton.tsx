function DiscussionSkeleton() {
  return (
    <div className="-mt-0.5 flex h-full flex-col gap-4">
      <div className="flex w-full gap-2">
        <div className="shimmer h-10 flex-1 rounded-lg" />
        <div className="shimmer h-10 flex-1 rounded-lg" />
      </div>
      <div className="shimmer w-full flex-1 rounded-md" />
      <div>
        <div className="shimmer h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

export { DiscussionSkeleton };
