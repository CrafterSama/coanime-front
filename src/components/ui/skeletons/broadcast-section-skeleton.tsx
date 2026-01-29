import { AnimeCardSkeleton } from './anime-card-skeleton';
import { SectionTitleSkeleton } from './section-title-skeleton';

export function BroadcastSectionSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitleSkeleton />

        <div className="mb-10">
          <div className="mb-4 h-6 w-40 rounded bg-gray-200 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 h-6 w-40 rounded bg-gray-200 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
