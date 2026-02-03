import { Check, ChevronDown, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

export interface AsyncSearchableSelectOption {
  label: string;
  value: number | string;
}

export interface AsyncSearchableSelectProps {
  value?: number | string;
  label?: string;
  onChange?: (opt: AsyncSearchableSelectOption | null) => void;
  fetchOptions: (q: string) => Promise<AsyncSearchableSelectOption[]>;
  placeholder?: string;
  disabled?: boolean;
  minChars?: number;
  debounceMs?: number;
  className?: string;
}

export const AsyncSearchableSelect = React.forwardRef<
  HTMLButtonElement,
  AsyncSearchableSelectProps
>(
  (
    {
      value,
      label,
      onChange,
      fetchOptions,
      placeholder = 'Buscar...',
      disabled = false,
      minChars = 3,
      debounceMs = 400,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [options, setOptions] = React.useState<AsyncSearchableSelectOption[]>(
      []
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const debouncedSearch = useDebounce(search, debounceMs);
    const fetchRef = React.useRef(fetchOptions);
    fetchRef.current = fetchOptions;

    const displayLabel = label ?? '';

    React.useEffect(() => {
      if (open && inputRef.current) {
        const t = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(t);
      }
      if (!open) {
        setSearch('');
        setOptions([]);
      }
      return undefined;
    }, [open]);

    React.useEffect(() => {
      if (!open) return;
      const q = debouncedSearch.trim();
      if (q.length < minChars) {
        setOptions([]);
        return;
      }
      let cancelled = false;
      setIsLoading(true);
      fetchRef
        .current(q)
        .then((list) => {
          if (!cancelled) setOptions(list);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [debouncedSearch, open, minChars]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    };

    const handleSelect = (opt: AsyncSearchableSelectOption) => {
      onChange?.(opt);
      setOpen(false);
      setSearch('');
    };

    const handleClear = () => {
      onChange?.(null);
      setOpen(false);
      setSearch('');
    };

    const showMinChars =
      search.trim().length > 0 && search.trim().length < minChars;
    const showNoResults =
      debouncedSearch.trim().length >= minChars &&
      !isLoading &&
      options.length === 0;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between h-9 font-normal shadow-[3px_0px_6px_0_rgba(0,0,0,0.15)]',
              !displayLabel && 'text-muted-foreground',
              className
            )}>
            <span className="truncate">{displayLabel || placeholder}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 border-0"
          align="start">
          <div className="flex flex-col">
            <div className="flex items-center px-3">
              <Input
                ref={inputRef}
                placeholder={`Buscar (mín. ${minChars} caracteres)...`}
                value={search}
                onChange={handleSearchChange}
                className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus-visible:shadow-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {showMinChars ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Escribe al menos {minChars} caracteres para buscar
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : showNoResults ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No se encontraron resultados
                </div>
              ) : (
                <>
                  {value != null && value !== '' && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleClear}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), handleClear())
                      }
                      className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                      — Limpiar selección
                    </div>
                  )}
                  {options.map((opt, idx) => {
                    const isSelected =
                      value != null && String(opt.value) === String(value);
                    return (
                      <div
                        key={`async-sel-${String(opt.value)}-${idx}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelect(opt)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), handleSelect(opt))
                        }
                        className={cn(
                          'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-orange-50 text-orange-900'
                        )}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

AsyncSearchableSelect.displayName = 'AsyncSearchableSelect';
