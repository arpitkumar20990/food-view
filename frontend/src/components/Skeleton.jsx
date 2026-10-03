/**
 * Reusable Shimmer Skeleton components
 */

export const SkeletonBox = ({ className = '' }) => (
  <div
    className={`bg-gray-200 relative overflow-hidden rounded-xl ${className}`}
  >
    <div className="absolute inset-0 animate-shimmer" />
  </div>
);

export const DarkSkeletonBox = ({ className = '' }) => (
  <div
    className={`bg-gray-800 relative overflow-hidden rounded-xl ${className}`}
  >
    <div className="absolute inset-0 dark-shimmer" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in" aria-label="Loading profile content">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
      <SkeletonBox className="w-36 h-36 md:w-44 md:h-44 rounded-full flex-shrink-0" />
      <div className="flex-1 w-full space-y-4">
        <SkeletonBox className="h-8 w-48 md:w-64" />
        <SkeletonBox className="h-5 w-72 md:w-96" />
        <div className="flex gap-10 py-2">
          <SkeletonBox className="h-10 w-20" />
          <SkeletonBox className="h-10 w-24" />
        </div>
        <div className="flex gap-3 pt-2">
          <SkeletonBox className="h-12 w-36 rounded-full" />
          <SkeletonBox className="h-12 w-28 rounded-full" />
        </div>
      </div>
    </div>
    
    <div className="border-t border-gray-200 my-8" />
    
    {/* Grid Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBox key={i} className="aspect-square w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

export const ReelFeedSkeleton = () => (
  <div className="h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden" aria-label="Loading reels">
    <DarkSkeletonBox className="h-full w-full max-w-[420px]" />
    <div className="absolute bottom-6 left-6 right-6 space-y-3 max-w-[380px]">
      <DarkSkeletonBox className="h-6 w-3/4 rounded" />
      <DarkSkeletonBox className="h-4 w-1/2 rounded" />
      <DarkSkeletonBox className="h-12 w-32 rounded-full mt-4" />
    </div>
  </div>
);
