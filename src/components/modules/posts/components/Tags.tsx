import Link from 'next/link';

const Tags = ({ tags }) => (
  <div className="tags">
    <ul className="info__article-tags">
      {tags?.length > 0 &&
        tags?.map((tag) => (
          <li key={tag?.id}>
            <Link href={`/tags/${tag?.slug}`}>
              <a className="tag">{tag?.name}</a>
            </Link>
          </li>
        ))}
    </ul>
  </div>
);

export default Tags;
