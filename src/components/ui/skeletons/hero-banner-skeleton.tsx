export function HeroBannerSkeleton() {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="container mx-auto">
          <div className="h-6 w-24 bg-gray-300 rounded mb-3"></div>
          <div className="h-10 w-full max-w-3xl bg-gray-300 rounded mb-3"></div>
          <div className="h-10 w-full max-w-3xl bg-gray-300 rounded mb-3"></div>
          <div className="h-6 w-full max-w-2xl bg-gray-300 rounded mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="h-12 w-32 bg-gray-300 rounded mt-6"></div>
        </div>
      </div>
    </div>
  );
}
