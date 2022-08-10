import { useState } from 'react';

import Head from 'next/head';

import WebLayout from '@/components/Layouts/WebLayout';
import SerieCard from '@/components/modules/titles/components/SerieCard';
import CloudLinks from '@/components/ui/CloudLinks';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { useExternalTitles } from '@/hooks/titles';

const Titles = () => {
  const [page, setPage] = useState(1);
  const { data = {}, isLoading } = useExternalTitles({ page });
  const { title, description, keywords, result: series, genres, types } = data;

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading showFancySpiner size={20} />
        </div>
      )}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Section withContainer>
        <CloudLinks allLink="/ecma/titulos" links={types} />
        <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[90vh]">
          {series?.data?.map((serie) => (
            <SerieCard key={serie?.id} serie={serie} />
          ))}
        </div>
        <Paginator page={page} setPage={setPage} lastPage={series?.lastPage} />
      </Section>
    </WebLayout>
  );
};

export default Titles;
