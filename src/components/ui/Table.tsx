import { ChevronDownIcon, ChevronUpIcon, SwitchVerticalIcon } from '@/components/icons';
import { SORTING_TYPES } from '@/constants/common';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import cn from 'classnames';
import { FC, useState } from 'react';

type RowsProps = {
  columns: any[];
  row: any[];
  innerRowColumns?: any[];
  innerRowItems?: any[];
  rowExpandable?: boolean;
};

export const Rows: FC<RowsProps> = ({
  columns,
  row,
  innerRowColumns = [],
  innerRowItems = [],
  rowExpandable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tdStyles = (column) =>
    cn(`p-2 ${column.cellClass}`, {
      'sticky bg-white': column.fixed,
      'bg-white': !column.fixed,
    });

  const renderCell = (row, column) => {
    const { accessor, cell } = column;
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
        <tr>
          {columns.map((column, i) => (
            <td key={`${column.name}-${i}`} className={tdStyles(column)}>
              {column.firstItem ? (
                <div className="flex flex-row items-center justify-between py-2 space-x-3 bg-white">
                  <div className="ml-2">{renderCell(row, column)}</div>
                  {column.firstItem && (innerRowItems.length >= 1 || rowExpandable) && (
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
                  )}
                </div>
              ) : (
                <div className="ml-2">{renderCell(row, column)}</div>
              )}
            </td>
          ))}
        </tr>
        <CollapsiblePrimitive.Content asChild>
          <>
            {innerRowItems?.map((item: any, i) => {
              return (
                <tr key={i} className="">
                  {innerRowColumns.map((column, j) => (
                    <td key={`${column.name}-${j}`} className="p-2">
                      <div className="ml-2">{renderCell(item, column)}</div>
                    </td>
                  ))}
                </tr>
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

export const Table: FC<TableProps> = ({ children, columns, fixedHeader = true }) => {
  const thStyles = (column, fixedHeader) =>
    cn('z-10 bg-gray-200 font-regular uppercase text-gray-600 text-md pt-2 px-2 pb-2 text-left align-center', {
      sticky: fixedHeader || column.fixed,
      'top-0': fixedHeader,
      'bg-gray-200': fixedHeader && !column.fixed,
      'bg-gray-200 z-20 ': column.fixed,
      'left-checkbox': column.fixed && column?.withFixedCheckbox,
      'left-0': column.fixed && !column?.withFixedCheckbox,
    });
  const handleSortChange = (index, currentSort) => {
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

  const WrapperSorting = ({ index, sort, children }) => (
    <span className="flex items-center ml-2 cursor-pointer" onClick={() => handleSortChange(index, sort)}>
      {children}
    </span>
  );

  const renderSorting = (index, column) => {
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
        <table className="min-w-full bg-white text-left">
          <thead>
            <tr className="p-2">
              {columns.map((column, i) => (
                <th key={`${column.name}-${i}`} className={thStyles(column, fixedHeader)}>
                  <div className="ml-2 flex flex-row items-center">
                    {column?.sorting ? (
                      renderSorting(i, column)
                    ) : (
                      <span className="text-sm whitespace-nowrap">{column.name}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="rounded-lg overflow-auto max-h-screen">
        <table className="min-w-full bg-white text-left">
          <tbody className="text-base">{children}</tbody>
        </table>
      </div>
    </div>
  );
};
