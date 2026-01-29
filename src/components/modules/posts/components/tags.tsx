import Link from 'next/link';

import React from 'react';

const Tags = ({ tags }: { tags?: any[] }) => (
  <div className="tags">
    <ul className="info__article-tags">
      {tags &&
        tags.length !== undefined &&
        tags.length > 0 &&
        tags?.map((tag: any) => (
          <li key={tag?.id}>
            <Link href={`/tags/${tag?.slug}`} className="tag">
              {tag?.name}
            </Link>
          </li>
        ))}
    </ul>
  </div>
);

export default Tags;
