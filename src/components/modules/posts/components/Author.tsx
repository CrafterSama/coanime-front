import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';

const Author = ({ users }) => (
  <div className="author">
    <div className="info__article-author">
      <div className="flex flex-col w-32 h-32 relative">
        <Image
          src={
            users?.profilePhotoPath ? users?.profilePhotoPath : DEFAULT_IMAGE
          }
          alt={users?.name}
          className="w-full h-full"
          fill
          quality={90}
        />
      </div>
      <div className="info__author">
        <div className="info__author-name">
          <Link
            href={`/users/[slug]`}
            as={`/users/${users?.slug}`}
            className="text-gray-300">
            {users?.name}
          </Link>
        </div>
        <div
          className="info__author-ocupation"
          dangerouslySetInnerHTML={{ __html: users?.bio ?? '-' }}></div>
      </div>
    </div>
  </div>
);

export default Author;
