import Image from 'next/image';
import Link from 'next/link';

import SectionTitle from '@/components/ui/SectionTitle';
import { DEFAULT_IMAGE } from '@/constants/common';

const Relateds = ({ relateds }) => {
  return (
    <div id="relateds" className="px-4">
      {relateds?.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionTitle
            title="Relacionados"
            subtitle="Relacionadas al Titulo"
          />
          {relateds
            ?.filter((related) => related !== null)
            .map((related) => (
              <div key={related?.id} className="flex flex-row gap-4">
                <Link href={`/posts/${related?.slug}`}>
                  <div className="info__relateds-image w-24 h-24 relative">
                    <Image
                      src={related?.image ?? DEFAULT_IMAGE}
                      alt={related?.title}
                      className="w-full h-full"
                      fill
                    />
                  </div>
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="categories ">
                    <Link href={`/categorias/${related?.categories?.slug}`}>
                      {related?.categories?.name}
                    </Link>
                  </div>
                  <Link href={`/posts/${related?.slug}`}>
                    <h3 className="info__relateds-title">{related?.title}</h3>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Relateds;
