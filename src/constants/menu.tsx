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
    breadcrumb: 'dashboard',
    icon: <ChipIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Dashboard',
  },
  {
    href: '/dashboard/posts?page=1',
    breadcrumb: 'posts',
    icon: <NewspaperIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Posts',
  },
  {
    href: '/dashboard/titles?page=1',
    breadcrumb: 'titles',
    icon: <PhotographIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Titles',
  },
  {
    href: '/dashboard/people',
    breadcrumb: 'people',
    icon: <UsersIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'People',
  },
  {
    href: '/dashboard/magazine',
    breadcrumb: 'magazine',
    icon: <BookOpenIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Magazine',
  },
  {
    href: '/dashboard/companies',
    breadcrumb: 'companies',
    icon: <OfficeBuildingIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Companies',
  },
  {
    href: '/dashboard/events',
    breadcrumb: 'events',
    icon: <LocationMarkerIcon className="w-6 h-6 fill-current text-gray-600" />,
    text: 'Events',
  },
];
