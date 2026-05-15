function GradeDistributionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-uic-navy-300/10 dark:border-foreground/5 flex flex-col justify-between gap-0 rounded-xl border py-8 shadow-none">
        <div className="flex flex-row justify-between px-6 pb-2">
          <div className="flex flex-col gap-2 pt-1">
            <div className="shimmer h-5 w-40 rounded-md xl:h-6" />
            <div className="shimmer h-4 w-32 rounded-md" />
          </div>
          <div className="shimmer h-20 w-28 rounded-xl md:w-32" />
        </div>
        <div className="px-6">
          <div className="shimmer aspect-video mt-2 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 py-1">
        <div className="shimmer mx-auto h-3 w-full rounded-md" />
        <div className="shimmer mx-auto h-3 w-11/12 rounded-md" />
        <div className="shimmer visible mx-auto h-3 w-10/12 rounded-md md:invisible" />
      </div>
    </div>
  );
}

export { GradeDistributionSkeleton };
