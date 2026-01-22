import type { ReactNode, CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  customIcon?: ReactNode;
  isActive?: boolean;
  eventName?: string;
  showButton?: boolean;
  accessRole?: string[];
  className?: string;
  name?: string;
  breadcrumb?: string;
  style?: CSSProperties;
  items?: MenuItem[];
  newWindow?: boolean;
}
