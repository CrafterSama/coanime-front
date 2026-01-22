import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Variantes personalizadas para mantener compatibilidad
        solid: 'bg-orange-500 text-white hover:bg-orange-600',
        'solid-orange': 'bg-orange-500 text-white hover:bg-orange-600',
        'solid-purple': 'bg-purple-500 text-white hover:bg-purple-600',
        'solid-teal': 'bg-teal-500 text-white hover:bg-teal-600',
        'solid-red': 'bg-red-500 text-white hover:bg-red-600',
        'solid-yellow': 'bg-yellow-500 text-white hover:bg-yellow-600',
        'solid-blue': 'bg-blue-500 text-white hover:bg-blue-600',
        'outline-orange':
          'border border-orange-500 text-orange-500 hover:bg-orange-50',
        'outline-purple':
          'border border-purple-500 text-purple-500 hover:bg-purple-50',
        'outline-teal': 'border border-teal-500 text-teal-500 hover:bg-teal-50',
        'outline-red': 'border border-red-500 text-red-500 hover:bg-red-50',
        'outline-yellow':
          'border border-yellow-500 text-yellow-500 hover:bg-yellow-50',
        'outline-blue': 'border border-blue-500 text-blue-500 hover:bg-blue-50',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'prefix' | 'suffix'
    >,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color?: 'orange' | 'purple' | 'teal' | 'red' | 'yellow' | 'blue';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: variantProp,
      size,
      asChild = false,
      prefix,
      suffix,
      children,
      color,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Mapear color a variant si se proporciona
    let variant = variantProp;
    let colorClasses = '';
    if (color && !variantProp) {
      // Si solo hay color, usar 'destructive' para red, clases personalizadas para otros
      if (color === 'red') {
        variant = 'destructive';
      } else {
        // Para otros colores, usar clases personalizadas
        const colorMap: Record<string, string> = {
          orange: 'bg-orange-500 text-white hover:bg-orange-600',
          purple: 'bg-purple-500 text-white hover:bg-purple-600',
          teal: 'bg-teal-500 text-white hover:bg-teal-600',
          yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
          blue: 'bg-blue-500 text-white hover:bg-blue-600',
        };
        colorClasses = colorMap[color] || '';
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className: colorClasses ? undefined : className,
          }),
          colorClasses,
          colorClasses ? className : undefined
        )}
        ref={ref}
        {...props}>
        {prefix && <span className="flex items-center">{prefix}</span>}
        {children}
        {suffix && <span className="flex items-center">{suffix}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
