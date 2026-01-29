import 'dayjs/locale/es';

import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { Plus } from 'lucide-react';
import { ArticleCard } from './article-card';

const RecentPosts = ({ posts }: { posts?: any[] }) => (
  <Section withContainer>
    <SectionTitle title="Recientes" subtitle="Noticias Recientes" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post: any, index: number) => (
        <ArticleCard
          key={Number(post?.id)}
          post={post}
          size={index === 0 ? 'large' : 'medium'}
        />
      ))}
    </div>
    <div className="w-full flex justify-end items-center mt-2 px-4">
      <a className="flex flex-row items-center text-orange-500" href="#news">
        <Plus className="w-6 h-6 text-orange-400" />
        Mas Noticias
      </a>
    </div>
  </Section>
);

export default RecentPosts;
