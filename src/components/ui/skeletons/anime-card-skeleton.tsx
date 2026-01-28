export function AnimeCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="relative h-[300px] w-full bg-gray-200 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4">
        <div className="h-5 w-full rounded bg-gray-300 animate-pulse mb-2"></div>
        <div className="h-4 w-16 rounded bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
}
