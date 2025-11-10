export default function Loading() {
  return (
    <div className="animate-pulse flex flex-col md:flex-row bg-background w-full h-full md:h-[calc(100svh-120px)] overflow-scroll">
      {/* Stats Skeleton */}
      <div className="flex flex-col gap-10 h-fit w-full md:w-1/2 p-8 md:h-full">
        <div className="flex items-baseline mt-4 p-8 bg-gray-400/5 rounded-md">
          <div className="w-full rounded-md h-80 bg-gray-400/30"></div>
          <div className="w-full h-60 ms-6 rounded-md bg-gray-400/30"></div>
          <div className="w-full rounded-md h-70 ms-6 bg-gray-400/30"></div>
          <div className="w-full h-50 ms-6 rounded-md bg-gray-400/30"></div>
          <div className="w-full rounded-md h-30 ms-6 bg-gray-400/30"></div>
        </div>
        <div className="bg-gray-400/30 h-3/4 w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-1/4 w-full rounded-md"></div>
      </div>

      {/* Comments Skeleton */}
      <section className="flex flex-col gap-10 h-fit md:h-full w-full min-h-0 md:max-w-1/4 md:w-1/4 relative border-r border-l border-foreground/10 p-8">
        <div className="bg-gray-400/30 h-10/12 rounded-md"></div>
        <div className="bg-gray-400/30 h-2/12 rounded-md"></div>
      </section>

      {/* Breakdown Skeleton */}
      <section className="flex flex-col justify-between h-fit md:h-full gap-5 min-h-0 w-full md:max-w-1/4 md:w-1/4 p-8">
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
        <div className="bg-gray-400/30 h-full w-full rounded-md"></div>
      </section>
    </div>
  );
}
