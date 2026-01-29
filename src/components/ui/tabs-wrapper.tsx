import React from 'react';
import {
  Tabs as TabsPrimitive,
  TabsList,
  TabsTrigger,
  TabsContent as TabsContentPrimitive,
} from './tabs';
import { cn } from '@/lib/utils';

// Wrapper para mantener compatibilidad con la API anterior
export const Tabs = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      'inline-block p-1 font-bold text-xl cursor-pointer border-b-2 transition-colors',
      {
        'text-gray-400 border-transparent': !active,
        'text-gray-700 border-orange-500': active,
      }
    )}
    onClick={onClick}>
    {children}
  </div>
);

export const TabsContent = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => <div>{active && <div className="mt-4">{children}</div>}</div>;

// Exportar también los componentes de shadcn/ui para uso directo
export { TabsPrimitive, TabsList, TabsTrigger, TabsContentPrimitive };
