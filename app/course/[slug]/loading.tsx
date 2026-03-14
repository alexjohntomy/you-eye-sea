export default function Loading() {
  return (
    <div className="bg-background flex h-full w-full flex-col overflow-scroll md:h-[calc(100svh-120px)] md:flex-row">
      {/* Left: chart + stats */}
      <div className="flex h-full w-full flex-col gap-4 p-6 md:w-1/2">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="shimmer h-10 w-44 rounded-md" />
            <div className="shimmer h-5 w-56 rounded-md" />
          </div>
          <div className="shimmer h-9 w-28 rounded-md" />
        </div>
        <div className="flex flex-row gap-2">
          <div className="shimmer h-8 w-36 rounded-full" />
          <div className="shimmer h-8 w-24 rounded-full" />
        </div>
        <div className="shimmer min-h-52 flex-1 rounded-lg" />
        <div className="shimmer h-8 w-full rounded-md" />
      </div>

      {/* Middle: discussion */}
      <section className="border-foreground/10 relative flex min-h-60 w-full flex-col gap-4 border-r border-l p-8 md:h-full md:w-1/4 md:max-w-1/4">
        <div className="shimmer min-h-40 flex-5 rounded-md" />
        <div className="shimmer min-h-12 flex-1 rounded-md" />
      </section>

      {/* Right: breakdown table */}
      <section className="flex min-h-60 w-full flex-col justify-between gap-3 p-8 md:h-full md:w-1/4 md:max-w-1/4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shimmer min-h-8 w-full flex-1 rounded-md" />
        ))}
      </section>
    </div>
  );
}
