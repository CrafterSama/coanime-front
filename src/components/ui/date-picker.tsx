import * as React from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  format?: string;
  calendarIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Selecciona una fecha',
  disabled = false,
  className,
  showTime = false,
  format: formatStr = 'dd-MM-yyyy',
  calendarIcon,
  clearIcon,
}) => {
  const [date, setDate] = React.useState<Date | null | undefined>(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    const newDate = selectedDate || null;
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(null);
    if (onChange) {
      onChange(null);
    }
  };

  const formatDate = (dateToFormat: Date | null | undefined) => {
    if (!dateToFormat) return null;
    try {
      // Formato personalizado para compatibilidad con react-datetime-picker
      if (formatStr === 'dd-MM-yyyy') {
        return dayjs(dateToFormat).format('DD-MM-YYYY');
      }
      return dayjs(dateToFormat).locale('es').format('D [de] MMMM [de] YYYY');
    } catch {
      return dayjs(dateToFormat).locale('es').format('D [de] MMMM [de] YYYY');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-9 !border-0 !shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] hover:!shadow-[0_2px_6px_0_rgba(0,0,0,0.2)] focus-visible:!ring-orange-400 focus-visible:!shadow-[0_2px_6px_0_rgba(0,0,0,0.2)]',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}>
          {calendarIcon || <CalendarIcon className="mr-2 h-4 w-4" />}
          {date ? (
            <span className="flex-1">{formatDate(date)}</span>
          ) : (
            <span className="flex-1">{placeholder}</span>
          )}
          {clearIcon && date && (
            <span
              className="ml-2 cursor-pointer"
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}>
              {clearIcon}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTime && date && (
          <div className="p-3 border-t border-gray-100">
            <input
              type="time"
              className="w-full px-3 py-2 h-9 border border-gray-100 rounded-md shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] focus:outline-none focus:ring-1 focus:ring-orange-400 focus:shadow-[0_2px_6px_0_rgba(0,0,0,0.2)]"
              value={dayjs(date).format('HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const newDate = new Date(date);
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                handleDateSelect(newDate);
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
