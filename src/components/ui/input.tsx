import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  endIcon?: React.ReactNode;
  endIconAction?: () => void;
  label?: string;
  errors?: string;
  hint?: string;
  lowerHint?: number;
  charactersCount?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      suffix,
      endIcon,
      endIconAction,
      label,
      errors,
      hint,
      lowerHint,
      charactersCount,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasPrefix = !!prefix;
    const hasSuffix = !!suffix || !!endIcon;
    const hasLabel = !!label;
    const hasErrors = !!errors;
    const hasHint =
      !!hint || lowerHint !== undefined || charactersCount !== undefined;

    const inputElement = (
      <div className="relative flex items-center">
        {hasPrefix && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-9 w-full rounded-md bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            hasPrefix ? 'pl-10' : 'pl-3',
            hasSuffix ? 'pr-10' : 'pr-3',
            hasErrors && 'border-destructive focus-visible:ring-destructive',
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

    if (!hasLabel && !hasErrors && !hasHint) {
      return inputElement;
    }

    return (
      <div className="flex flex-col gap-1">
        {hasLabel && (
          <Label
            htmlFor={inputId}
            className={hasErrors ? 'text-destructive' : ''}>
            {label}
          </Label>
        )}
        {inputElement}
        {hasErrors && <p className="text-sm text-destructive">{errors}</p>}
        {!hasErrors &&
          (hint ||
            lowerHint !== undefined ||
            charactersCount !== undefined) && (
            <div className="flex justify-between items-center">
              {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
              {lowerHint !== undefined && (
                <p className="text-sm text-muted-foreground">{lowerHint}</p>
              )}
              {charactersCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {charactersCount}
                </p>
              )}
            </div>
          )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
