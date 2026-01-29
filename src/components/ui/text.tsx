import React from 'react';

import cn from 'classnames';

type As =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'small'
  | 'caption'
  | 'span';

export type Color =
  | 'white'
  | 'gray-400'
  | 'gray-800'
  | 'primary'
  | 'cta-400'
  | 'positive-400'
  | 'negative-400'
  | 'caution-400'
  | 'blue-400';

export type Size =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TextProps = {
  children: React.ReactNode;
  as?: As;
  className?: string;
  color?: Color;
  fontWeight?: FontWeight;
  size?: Size;
  leading?: 'none' | 'normal' | 'tight' | 'loose';
};

const Text = React.forwardRef(function TextWithRef(
  {
    as = 'span',
    className = '',
    color = 'gray-800',
    fontWeight = 'normal',
    leading,
    size = 'base',
    children,
  }: TextProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = cn(className, {
    [`text-${size}`]: true,
    [`text-${color}`]: true,
    [`font-${fontWeight}`]: true,
    [`leading-${leading}`]: leading !== undefined && leading !== null,
  });

  return React.createElement(
    as,
    {
      ref,
      className: classes,
    },
    children
  );
});

export default Text;
