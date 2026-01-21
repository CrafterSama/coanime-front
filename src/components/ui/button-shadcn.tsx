import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
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
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        // Tamaños personalizados para compatibilidad
        small: 'h-8 px-2 py-1 text-xs',
        regular: 'h-10 px-4 py-2 text-sm',
        normal: 'h-12 px-6 py-3 text-base',
        large: 'h-14 px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  secondText?: string;
  full?: boolean;
  // Props de compatibilidad con el componente antiguo
  color?: 'orange' | 'purple' | 'teal' | 'red' | 'yellow' | 'blue';
  rounded?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: variantProp,
      size: sizeProp,
      asChild = false,
      loading = false,
      prefix,
      suffix,
      secondText,
      full,
      children,
      disabled,
      color,
      rounded,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    // Mapear color y variant a la nueva API
    let variant = variantProp;
    if (color && variantProp) {
      // Si hay color y variant, combinar: 'solid-orange', 'outline-purple', etc.
      variant = `${variantProp}-${color}` as any;
    } else if (color && !variantProp) {
      // Si solo hay color, usar 'solid' como default
      variant = `solid-${color}` as any;
    } else if (!variantProp) {
      variant = 'default';
    }

    // Mapear size
    let size = sizeProp;
    if (!size) {
      size = 'default';
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          full && 'w-full',
          rounded && 'rounded-full',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}>
        {prefix && <span className="mr-2 flex items-center">{prefix}</span>}
        {loading ? (
          <span className="flex items-center animate-pulse">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : (
          <>
            {children}
            {secondText && <span className="ml-2">{secondText}</span>}
          </>
        )}
        {suffix && <span className="ml-2 flex items-center">{suffix}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
