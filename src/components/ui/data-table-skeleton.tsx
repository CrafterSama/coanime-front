import { Skeleton } from './skeleton';

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton component that only shows skeleton for table rows and pagination
 * This should be used inside the DataTable structure, not replacing it
 */
export function DataTableRowsSkeleton({
  rows = 10,
  columns = 6,
}: DataTableSkeletonProps) {
  return (
    <>
      {/* Skeleton rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-100 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4 align-middle">
              <Skeleton
                className={
                  colIndex === 0
                    ? 'h-16 w-16 rounded-lg'
                    : colIndex === 1
                    ? 'h-4 w-48'
                    : 'h-4 w-full'
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Skeleton for pagination only
 */
export function DataTablePaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
