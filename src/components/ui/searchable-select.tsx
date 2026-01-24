import { Check, ChevronDown, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  label: string;
  value: number | string;
  type?: string;
}

export interface SearchableSelectProps {
  options?: SearchableSelectOption[];
  value?: number | string;
  onValueChange?: (value: number | string | null) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  getOptionLabel?: (option: SearchableSelectOption) => string;
  className?: string;
}

export const SearchableSelect = React.forwardRef<
  HTMLButtonElement,
  SearchableSelectProps
>(
  (
    {
      options = [],
      value,
      onValueChange,
      onSearchChange,
      placeholder = 'Seleccionar...',
      isLoading = false,
      getOptionLabel,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = React.useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    React.useEffect(() => {
      if (open && inputRef.current) {
        // Pequeño delay para asegurar que el popover esté completamente renderizado
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else if (!open) {
        // Limpiar búsqueda cuando se cierra
        setSearch('');
      }
    }, [open]);

    const displayValue = React.useMemo(() => {
      if (selectedOption) {
        return getOptionLabel
          ? getOptionLabel(selectedOption)
          : selectedOption.type
          ? `${selectedOption.label} (${selectedOption.type})`
          : selectedOption.label;
      }
      return '';
    }, [selectedOption, getOptionLabel]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      if (onSearchChange) {
        onSearchChange(newSearch);
      }
    };

    const handleSelect = (option: SearchableSelectOption) => {
      if (onValueChange) {
        onValueChange(option.value);
      }
      setOpen(false);
      setSearch('');
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-9 font-normal shadow-[3px_0px_6px_0_rgba(0,0,0,0.15)]',
              !displayValue && 'text-muted-foreground',
              className
            )}>
            <span className="truncate">{displayValue || placeholder}</span>
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
                placeholder="Buscar..."
                value={search}
                onChange={handleSearchChange}
                className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus-visible:shadow-none"
                onKeyDown={(e) => {
                  // Prevenir que Enter cierre el popover
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : options.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {search.length < 2
                    ? 'Escribe al menos 2 caracteres para buscar'
                    : 'No se encontraron resultados'}
                </div>
              ) : (
                options.map((option) => {
                  const optionLabel = getOptionLabel
                    ? getOptionLabel(option)
                    : option.type
                    ? `${option.label} (${option.type})`
                    : option.label;
                  const isSelected = value === option.value;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus:bg-accent focus:text-accent-foreground',
                        isSelected && 'bg-orange-50 text-orange-900'
                      )}>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="truncate">{optionLabel}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';
