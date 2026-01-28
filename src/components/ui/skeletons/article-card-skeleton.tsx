interface ArticleCardSkeletonProps {
  size?: "small" | "medium" | "large";
}

export function ArticleCardSkeleton({
  size = "medium",
}: ArticleCardSkeletonProps) {
  const imageHeight =
    size === "small" ? "h-40" : size === "medium" ? "h-48" : "h-56";

  return (
    <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div
        className={`relative ${imageHeight} w-full bg-gray-200 animate-pulse`}
      ></div>
      <div className="p-4">
        <div className="mb-2 h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
        <div className="mb-2 h-6 w-full rounded bg-gray-200 animate-pulse"></div>
        {size !== "small" && (
          <div className="mb-4 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 rounded bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-3 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
