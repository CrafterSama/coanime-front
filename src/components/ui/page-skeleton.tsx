import { Skeleton } from './skeleton';

interface PageSkeletonProps {
  sections?: number;
}

export function PageSkeleton({ sections = 3 }: PageSkeletonProps) {
  return (
    <div className="space-y-8 p-4">
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          {/* Content grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, cardIndex) => (
              <div key={cardIndex} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
