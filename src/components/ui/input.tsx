import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  endIcon?: React.ReactNode;
  endIconAction?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, prefix, suffix, endIcon, endIconAction, ...props },
    ref
  ) => {
    const hasPrefix = !!prefix;
    const hasSuffix = !!suffix || !!endIcon;

    const inputElement = (
      <div className="relative flex items-center">
        {hasPrefix && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md bg-white text-base border border-gray-100 shadow-[3px_0px_6px_0_rgba(0,0,0,0.15)] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:shadow-orange-400 focus-visible:shadow-[3px_0_6px_0_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 md:text-sm',
            hasPrefix ? 'pl-10' : 'pl-3',
            hasSuffix ? 'pr-10' : 'pr-3',
            className
          )}
          ref={ref}
          {...props}
        />
        {hasSuffix && (
          <div
            className={cn(
              'absolute right-3 flex items-center',
              endIconAction && 'cursor-pointer'
            )}
            onClick={endIconAction}>
            {suffix || endIcon}
          </div>
        )}
      </div>
    );

    return inputElement;
  }
);
Input.displayName = 'Input';

export { Input };
