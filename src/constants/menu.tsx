import {
  BookOpenIcon,
  ChipIcon,
  LocationMarkerIcon,
  NewspaperIcon,
  OfficeBuildingIcon,
  PhotographIcon,
  UsersIcon,
} from '@/components/icons';

export const menu = [
  {
    href: '/dashboard',
    icon: <ChipIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Dashboard',
  },
  {
    href: '/posts',
    icon: <NewspaperIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Posts',
  },
  {
    href: '/titles',
    icon: <PhotographIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Titles',
  },
  {
    href: '/people',
    icon: <UsersIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'People',
  },
  {
    href: '/magazine',
    icon: <BookOpenIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Magazine',
  },
  {
    href: '/companies',
    icon: <OfficeBuildingIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Companies',
  },
  {
    href: '/events',
    icon: <LocationMarkerIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Events',
  },
];
