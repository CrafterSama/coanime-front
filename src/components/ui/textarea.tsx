import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md bg-white px-3 py-2 text-base shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] border border-gray-100 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:shadow-[0_2px_6px_0_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
