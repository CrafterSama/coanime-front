import Image from 'next/image';
import Link from 'next/link';

import { Permissions } from '@/components/modules/common/Permissions';
import SectionTitle from '@/components/ui/SectionTitle';
import { DEFAULT_IMAGE } from '@/constants/common';
import { PencilIcon } from '@heroicons/react/outline';

const TitleRelated = ({ titles }) => (
  <div id="relatedTitle" className="px-4">
    {titles?.length > 0 && (
      <>
        <SectionTitle title="Series" subtitle="Serie Relacionada" />
        <div className="relatedTitle">
          <div className="info__relatedTitle">
            <div className="info__relatedTitle-image h-96 relative">
              <Image
                className="w-full h-full"
                src={titles?.[0]?.images?.name ?? DEFAULT_IMAGE}
                alt={titles?.[0]?.name}
                objectFit="cover"
                layout="fill"
              />
              <Permissions>
                <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                  <Link href={`/dashboard/titles/${titles?.[0]?.id}`}>
                    <a className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                      <PencilIcon className="w-5 h-5" />
                    </a>
                  </Link>
                </div>
              </Permissions>
            </div>
            <div className="info__related">
              <p className="info__relatedTitle-category font-semibold">
                {titles?.[0]?.type?.name}
              </p>
              <Link
                href={`/ecma/titulos/${titles?.[0]?.type?.slug}/${titles?.[0]?.slug}`}
              >
                <a>
                  <h3 className="info__relatedTitle-title font-semibold">
                    {titles?.[0]?.name}
                  </h3>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

export default TitleRelated;
