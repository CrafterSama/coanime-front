import { Skeleton } from './skeleton';

interface CarouselSkeletonProps {
  items?: number;
}

export function CarouselSkeleton({ items = 6 }: CarouselSkeletonProps) {
  return (
    <div className="px-4 xl:px-0">
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[150px] md:w-[200px]">
            <Skeleton className="h-[250px] w-full rounded-lg mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
