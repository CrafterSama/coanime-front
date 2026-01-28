export function SectionTitleSkeleton() {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="h-8 w-40 rounded bg-gray-200 animate-pulse mb-2"></div>
      <div className="h-4 w-60 rounded bg-gray-200 animate-pulse"></div>
      <div className="mt-2 h-1 w-16 rounded bg-gray-200 animate-pulse"></div>
    </div>
  );
}
