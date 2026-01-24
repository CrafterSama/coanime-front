import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type DropdownProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  contentClasses?: string;
  width?: string | number;
  align?: 'left' | 'right' | 'top' | 'bottom';
};

const Dropdown = ({
  align = 'right',
  width = 48,
  contentClasses = 'py-1 bg-white',
  trigger,
  children,
}: DropdownProps) => {
  const alignMap = {
    top: 'start',
    left: 'start',
    right: 'end',
    bottom: 'end',
  } as const;

  const sideMap = {
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
  } as const;

  // Convertir width a clase de Tailwind o estilo inline
  const widthStyle =
    typeof width === 'number'
      ? { width: `${width * 0.25}rem` }
      : width.includes('w-')
      ? {}
      : { width: width };

  const widthClass =
    typeof width === 'number'
      ? ''
      : width.includes('w-')
      ? width
      : `w-[${width}]`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={alignMap[align] || 'end'}
        side={sideMap[align] || 'bottom'}
        className={cn(widthClass, contentClasses)}
        style={typeof width === 'number' ? widthStyle : undefined}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
