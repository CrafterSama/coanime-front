import Image from 'next/image';
import Link from 'next/link';

const Relateds = ({ relateds }) => (
  <div id="relateds">
    <div className="relateds">
      {relateds?.length > 0 &&
        relateds?.map((related) => (
          <div key={related?.id} className="info__relateds">
            <Link href={`/posts/${related?.slug}`}>
              <a>
                <div className="info__relateds-image w-24 h-24 relative">
                  <Image
                    src={related?.image}
                    alt={related?.title}
                    className="w-full h-full"
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
                <h3 className="info__relateds-title">{related?.title}</h3>
              </a>
            </Link>
          </div>
        ))}
    </div>
  </div>
);

export default Relateds;
