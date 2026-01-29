import Link from 'next/link';
import React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const DropdownLink = ({
  href,
  icon = null,
  children,
  className,
  ...props
}: {
  href: string;
  icon?: React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <DropdownMenuItem asChild>
    <Link
      href={href}
      className={cn(
        'w-full flex flex-row justify-between text-left cursor-pointer',
        className
      )}
      {...props}>
      {icon ?? ''}
      {children}
    </Link>
  </DropdownMenuItem>
);

export const DropdownButton = ({
  icon = null,
  children,
  className,
  ...props
}: {
  icon?: React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <DropdownMenuItem
    className={cn(
      'w-full flex flex-row justify-between text-left cursor-pointer',
      className
    )}
    {...props}>
    {icon ?? ''}
    {children}
  </DropdownMenuItem>
);

export default DropdownLink;
