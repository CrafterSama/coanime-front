import Image from 'next/image';
import Link from 'next/link';

const TitleRelated = ({ titles }) => (
  <div id="relatedTitle">
    {titles?.length > 0 && (
      <div className="relatedTitle">
        <div className="info__relatedTitle">
          <div className="info__relatedTitle-image h-96 relative">
            <Image
              className="w-full h-full"
              src={titles?.[0]?.images?.name}
              alt={titles?.[0]?.name}
              objectFit="cover"
              layout="fill"
            />
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
    )}
  </div>
);

export default TitleRelated;
