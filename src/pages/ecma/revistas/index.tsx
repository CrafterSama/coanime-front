import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import MagazineCard from '@/components/modules/magazine/components/MagazineCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getMagazines } from '@/services/magazine';

type MagazineData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

const Magazines = ({ magazinesData }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MagazineData>(magazinesData);

  const { result: magazines = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: '/ecma/revistas',
      query: {
        page,
      },
    });
    const response = await getMagazines({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

  return (
    <>
      <Head>
        <title>{magazinesData?.title}</title>
        <meta name="description" content={magazinesData?.description} />
        <meta name="keywords" content={magazinesData?.keywords} />
      </Head>
      <WebLayout>
        {!data && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {magazines && (
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {magazines?.data?.map((magazine) => (
                <MagazineCard key={magazine?.id} magazine={magazine} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={magazines} />
          </Section>
        )}
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const response = await getMagazines({ page: Number(params?.page) ?? 1 });

  if (response?.data?.code === 404) {
    return {
      notFound: true,
    };
  }

  const magazinesData = response.data;

  return {
    props: {
      magazinesData,
      revalidate: 5 * 60,
    },
  };
};

export default Magazines;
