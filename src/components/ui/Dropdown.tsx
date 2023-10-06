import React, { FC } from 'react';

import { Menu, Transition } from '@headlessui/react';

type DropdownProps = {
  children: React.ReactNode;
  trigger?: any;
  contentClasses?: string;
  width?: string | number;
  align?: 'left' | 'right' | 'top';
};

const Dropdown = ({
  align = 'right',
  width = 48,
  contentClasses = 'py-1 bg-white',
  trigger,
  children,
}: DropdownProps) => {
  const alignmentClasses = {
    top: 'origin-top',
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0',
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button as={React.Fragment}>{trigger}</Menu.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <div
              className={`absolute z-50 mt-2 w-${width} rounded-md shadow-lg ${alignmentClasses[align]}`}>
              <Menu.Items
                className={`rounded-md focus:outline-none ring-1 ring-black ring-opacity-5 ${contentClasses}`}
                static>
                {children}
              </Menu.Items>
            </div>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Dropdown;
