import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const defaultImage =
  'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg';

type EventCardProps = {
  event?: any;
};

const EventCard: FC<EventCardProps> = ({ event = [] }) => {
  return (
    <div className="title-item overflow-hidden py-4">
      <Image
        src={
          event?.image
            ? `https://api.coanime.net/storage/images/events/${event?.image}`
            : defaultImage
        }
        alt={event?.name}
        fill
        className="object-scale-down bg-gray-200 rounded"
        unoptimized
      />
      <div className="overlayer"></div>
      <div className="absolute top-0 right-0 left-0 bottom-0 p-2 grid grid-cols-1 grid-rows-2 gap-2">
        <div className="categories flex justify-between items-start py-1">
          <Link href={`/eventos/pais/${event?.country?.name.toLowerCase()}`}>
            {event?.country?.name}
          </Link>
        </div>
        <div className="flex flex-wrap justify-center content-end">
          <Link
            href={`/eventos/${event?.slug}`}
            className="text-white text-center text-xl font-semibold w-full">
            {event?.name}
          </Link>
          <div className="text-white">{event?.release?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
