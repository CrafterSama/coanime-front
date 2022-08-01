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
    href: '/dashboard/posts',
    icon: <NewspaperIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Posts',
  },
  {
    href: '/dashboard/titles',
    icon: <PhotographIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Titles',
  },
  {
    href: '/dashboard/people',
    icon: <UsersIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'People',
  },
  {
    href: '/dashboard/magazine',
    icon: <BookOpenIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Magazine',
  },
  {
    href: '/dashboard/companies',
    icon: <OfficeBuildingIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Companies',
  },
  {
    href: '/dashboard/events',
    icon: <LocationMarkerIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Events',
  },
];
