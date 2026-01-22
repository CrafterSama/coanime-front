import { FC, useState } from 'react';

import cn from 'classnames';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  SwitchVerticalIcon,
} from '@/components/icons';
import { SORTING_TYPES } from '@/constants/common';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

type RowsProps = {
  columns: any[];
  row: any[];
  innerRowColumns?: any[];
  innerRowItems?: any[];
  rowExpandable?: boolean;
};

const ChevronTrigger = ({
  innerRowItems,
  isOpen,
}: {
  innerRowItems: any[];
  isOpen: boolean;
}) => (
  <div className="flex justify-end">
    <CollapsiblePrimitive.Trigger asChild>
      {innerRowItems.length > 0 && (
        <div>
          {isOpen ? (
            <ChevronUpIcon className="cursor-pointer text-blue-grey-400 h-6 w-6" />
          ) : (
            <ChevronDownIcon className="cursor-pointer text-blue-grey-400 h-6 w-6" />
          )}
        </div>
      )}
    </CollapsiblePrimitive.Trigger>
  </div>
);

export const Rows: FC<RowsProps> = ({
  columns = [],
  row = [],
  innerRowColumns = [],
  innerRowItems = [],
  rowExpandable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tdStyles = (column: any) =>
    cn(
      `col-span-1 first:flex hidden md:flex py-2 first:justify-start justify-center items-center w-full  ${
        column.cellClass ?? ''
      }`,
      {
        'sticky bg-white': column.fixed,
        'bg-white': !column.fixed,
      }
    );

  const renderCell = (row: any, column: any) => {
    const { accessor, cell }: any = column;
    return typeof accessor === 'string' && !cell
      ? row[accessor]
      : typeof accessor === 'string'
      ? cell(row[accessor])
      : !cell
      ? ''
      : cell(accessor(row));
  };

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen} asChild>
      <>
        <div
          className={`grid grid-cols-${columns.length} grid-flow-col shadow-[0_1px_0_0_rgba(0,0,0,0.05)] group`}>
          {columns?.map((column, i) => (
            <div key={`${column.name}-${i}`} className={tdStyles(column)}>
              {column.firstItem ? (
                <div className="pl-4 border-l-4 border-transparent group-hover:border-orange-400">
                  {renderCell(row, column)}
                  {column.firstItem &&
                    (innerRowItems.length >= 1 || rowExpandable) && (
                      <ChevronTrigger
                        innerRowItems={innerRowItems}
                        isOpen={isOpen}
                      />
                    )}
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  {renderCell(row, column)}
                </div>
              )}
            </div>
          ))}
        </div>
        <CollapsiblePrimitive.Content asChild>
          <>
            {innerRowItems?.map((item: any, i) => {
              return (
                <div
                  key={i}
                  className={`grid grid-cols-${innerRowColumns?.length} grid-flow-col`}>
                  {innerRowColumns?.map((column, j) => (
                    <div key={`${column.name}-${j}`} className="p-2">
                      {renderCell(item, column)}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        </CollapsiblePrimitive.Content>
      </>
    </CollapsiblePrimitive.Root>
  );
};

type TableProps = {
  children: any;
  columns: any[];
  fixedHeader?: boolean;
};

export const Table: FC<TableProps> = ({
  children,
  columns = [],
  fixedHeader = true,
}) => {
  const thStyles = () =>
    cn('first:flex hidden md:flex justify-center items-center', {
      'sticky top-0': fixedHeader,
    });
  const handleSortChange = (index: number, currentSort: string) => {
    const column = columns[index];
    let sort = SORTING_TYPES.none;

    if (!currentSort || currentSort === SORTING_TYPES.none) {
      sort = SORTING_TYPES.asc;
    }

    if (currentSort === SORTING_TYPES.asc) {
      sort = SORTING_TYPES.desc;
    }

    column.sorting(sort);
  };

  const WrapperSorting = ({
    index,
    sort,
    children,
  }: {
    index: number;
    sort: string;
    children: React.ReactNode;
  }) => (
    <span
      className="flex items-center ml-2 cursor-pointer"
      onClick={() => handleSortChange(index, sort)}>
      {children}
    </span>
  );

  const renderSorting = (index: number, column: any) => {
    if (!column?.sorting) return null;

    const currentSort = column?.sort ?? 'none';

    if (currentSort === SORTING_TYPES.asc) {
      return (
        <WrapperSorting index={index} sort={currentSort}>
          {column.name} <ChevronUpIcon className="w-5 h-5" />
        </WrapperSorting>
      );
    }

    if (currentSort === SORTING_TYPES.desc) {
      return (
        <WrapperSorting index={index} sort={currentSort}>
          {column.name} <ChevronDownIcon className="w-5 h-5" />
        </WrapperSorting>
      );
    }

    return (
      <WrapperSorting index={index} sort={currentSort}>
        {column.name} <SwitchVerticalIcon className="w-4 h-4" />
      </WrapperSorting>
    );
  };

  return (
    <div className="rounded-lg flex flex-col">
      <div className="rounded-lg overflow-hidden">
        <div
          className={`grid grid-cols-${columns.length} grid-flow-col bg-gray-200 items-center px-4 py-2`}>
          {columns?.map((column, i) => (
            <div key={`${column.name}-${i}`} className={thStyles()}>
              <div
                className={`flex flex-row items-center justify-center uppercase font-semibold ${column.headerClassName}`}>
                {column?.sorting ? (
                  renderSorting(i, column)
                ) : (
                  <span className="text-sm whitespace-nowrap">
                    {column.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg overflow-auto max-h-screen">
        <div className="min-w-full bg-white text-left">
          <div className="text-base">{children}</div>
        </div>
      </div>
    </div>
  );
};
