import { ArticleCardSkeleton } from "./article-card-skeleton";
import { SectionTitleSkeleton } from "./section-title-skeleton";

export function RecentArticlesSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitleSkeleton />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ArticleCardSkeleton size="large" />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    </section>
  );
}
