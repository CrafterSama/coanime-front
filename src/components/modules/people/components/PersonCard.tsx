import Image from 'next/image';
import Link from 'next/link';

const defaultImage =
  'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg';

const PersonCard = ({ person }) => (
  <div className="title-item overflow-hidden py-4">
    <Image
      src={
        person?.image
          ? `https://api.coanime.net/storage/images/encyclopedia/people/${person?.image}`
          : defaultImage
      }
      alt={person?.name}
      fill
      className="w-full h-full"
    />
    <div className="overlayer"></div>
    <div className="absolute top-0 right-0 left-0 bottom-0 p-2 grid grid-cols-1 grid-rows-2 gap-2">
      <div className="categories flex justify-between items-start py-1">
        <span className="text-2xl">{person?.country?.emoji}</span>
        <Link href={`/ecma/personas/${person?.country?.name}`}>
          {person?.country?.name}
        </Link>
      </div>
      <div className="flex flex-wrap justify-center content-end">
        <Link
          href={`/ecma/personas/${person?.slug}`}
          className="text-white text-center text-xl font-semibold w-full flex flex-col">
          <span>{person?.name}</span>
          <span className="font-light text-base">({person.japaneseName})</span>
        </Link>
        <div className="text-white w-full text-center">
          {person?.areasSkillsHobbies}
        </div>
      </div>
    </div>
  </div>
);

export default PersonCard;
