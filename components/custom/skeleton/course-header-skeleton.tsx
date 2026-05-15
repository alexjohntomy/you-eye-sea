function CourseHeaderSkeleton() {
  return (
    <>
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col">
          <h1 className="text-uic-red-600 text-4xl leading-tight font-black">
            CS 101
          </h1>
          <p className="text-foreground/70 text-md leading-none font-medium">
            Introduction to Computer Science
          </p>
        </div>
        <div className="mt-1 flex shrink-0 flex-col gap-2 md:flex-row">
          <div className="shimmer h-10 w-32 rounded-xl" />
          <div className="shimmer h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="flex min-w-full flex-col gap-2 pt-2 xl:flex-row">
        <div className="flex-1">
          <div className="shimmer h-8.5 w-full rounded-lg" />
        </div>
        <div className="flex-1">
          <div className="shimmer h-8.5 w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}

export { CourseHeaderSkeleton };
