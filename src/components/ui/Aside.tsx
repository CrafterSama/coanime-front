import Link from 'next/link';
import { useRouter } from 'next/router';

import { CoanimeIcon, Logotype } from '@/components/ui/ApplicationLogo';
import { Show } from './Show';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { menu } from '@/constants/menu';
import { cn } from '@/lib/utils';

import React from 'react';

const Aside = () => {
  const router = useRouter();
  const path = router.asPath.split('/')[router.asPath.split('/').length - 1];
  const { state } = useSidebar();
  const isTiny = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="bg-white shadow-sm">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 overflow-hidden">
          <CoanimeIcon className="h-10 w-10 text-orange-500 flex-shrink-0" />
          <Show when={!isTiny}>
            <Logotype className="h-6 fill-current text-gray-800" />
          </Show>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden group-data-[collapsible=icon]:hidden">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const isActive = path === item.breadcrumb;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.text}
                      className={cn(
                        isActive
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-100 hover:text-orange-600 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      )}>
                      <Link href={item.href}>
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="hidden md:block menu-txt">
                          {item.text}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Aside;
