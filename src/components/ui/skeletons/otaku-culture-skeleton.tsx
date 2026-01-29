import { ArticleCardSkeleton } from './article-card-skeleton';
import { SectionTitleSkeleton } from './section-title-skeleton';

export function OtakuCultureSkeleton() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <SectionTitleSkeleton />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
