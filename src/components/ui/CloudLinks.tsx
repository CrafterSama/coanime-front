import Link from 'next/link';
import { useRouter } from 'next/router';

const CloudLinks = ({ allLink, links }) => {
  const router = useRouter();

  return (
    <div className="text-center px-4 py-2 max-w-4xl mx-auto py-4">
      <span className="text-center text-gray-600 hover:text-orange-600 font-semibold cloud-link">
        <Link href={allLink}>
          <a
            className={`${
              router.asPath.includes(allLink) && 'text-orange-600'
            } ml-1`}
          >
            Todas
          </a>
        </Link>
      </span>
      {links?.map((link) => (
        <span
          key={link?.id}
          className="text-center text-gray-600 hover:text-orange-600 font-semibold cloud-link"
        >
          <Link key={link?.id} href={`${allLink}/${link?.slug}`}>
            <a
              className={`${
                router.asPath.includes(link?.slug) && 'text-orange-600'
              } ml-1`}
            >
              {link?.name}
            </a>
          </Link>
        </span>
      ))}
    </div>
  );
};

export default CloudLinks;
