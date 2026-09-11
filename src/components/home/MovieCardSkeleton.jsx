export default function MovieCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 font-sans animate-pulse">
      {/* Poster Skeleton with Mixed Corner Radius */}
      <div
        className="relative aspect-[291/386] w-full overflow-hidden bg-neutral-300/80 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-white/5 rounded-tl-[25px] rounded-br-[25px] rounded-tr-none rounded-bl-none"
        style={{
          borderTopLeftRadius: '25px',
          borderBottomRightRadius: '25px',
          borderTopRightRadius: '0px',
          borderBottomLeftRadius: '0px',
        }}
      >
        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3 w-12 h-6 rounded-md bg-neutral-400/50 dark:bg-white/10" />
      </div>

      {/* Title & Metadata Skeleton */}
      <div className="space-y-2 px-0.5 pt-1">
        <div className="h-5 w-3/4 rounded bg-neutral-300 dark:bg-neutral-800" />
        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800/60" />
      </div>

      {/* Genre Pill Skeleton */}
      <div className="pt-0.5">
        <div className="h-6 w-20 rounded-full bg-neutral-300/70 dark:bg-neutral-800/80" />
      </div>
    </div>
  );
}
