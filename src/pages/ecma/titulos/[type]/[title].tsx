import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { useRandomImageByTitle } from '@/hooks/random-images';
import { useExternalTitle } from '@/hooks/titles';

const Titles = () => {
  const router = useRouter();
  const { data = {}, isLoading } = useExternalTitle({
    type: router?.query?.type,
    title: router?.query?.title,
  });

  const {
    data: randomImage,
    isLoading: isLoadingRandomImage,
  } = useRandomImageByTitle(router?.query?.title);

  const { title: webTitle, description, keywords, data: title } = data;

  return (
    <WebLayout>
      {isLoading ||
        (isLoadingRandomImage && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        ))}
      <Head>
        <title>{webTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      {data && randomImage && (
        <Section>
          <header className="min-h-[40vh] w-full overflow-hidden relative">
            <figure>
              <Image
                src={randomImage?.image}
                alt={title}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </figure>
          </header>
        </Section>
      )}
    </WebLayout>
  );
};

export default Titles;
