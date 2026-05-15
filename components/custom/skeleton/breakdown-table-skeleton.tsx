function BreakdownTableSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="shimmer mb-4 h-35 w-full rounded-2xl" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shimmer h-12 w-full rounded-md" />
        ))}
      </div>
      <div className="shimmer mx-auto mt-6 h-4 w-3/4 rounded-md" />
      <div className="shimmer mx-auto hidden h-4 w-1/2 rounded-md md:block" />
    </div>
  );
}

export { BreakdownTableSkeleton };
