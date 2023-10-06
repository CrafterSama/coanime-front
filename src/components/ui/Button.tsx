import cn from 'classnames';
import { Show, ShowAdvanced } from './Show';
import { ReactElement } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

type ButtonProps = {
  prefix?: any | ReactElement;
  suffix?: any | ReactElement;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'solid' | 'outline' | 'link';
  size?: 'large' | 'normal' | 'regular' | 'small';
  color?: 'orange' | 'purple' | 'teal' | 'red' | 'yellow' | 'blue';
  rounded?: boolean;
  full?: boolean;
  className?: string;
  children: any;
  secondText?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({
  prefix = null,
  suffix = null,
  type = 'submit',
  variant = 'solid',
  rounded = false,
  size = 'regular',
  color = 'orange',
  full = false,
  loading = false,
  children,
  secondText = '',
  className,
  ...props
}: ButtonProps) => {
  const sizes = {
    small: 'px-2 py-1 text-xs',
    regular: 'px-4 py-2 text-sm',
    normal: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const textColors = {
    orange:
      variant === 'outline' || variant === 'link'
        ? 'text-orange-400'
        : 'text-white hover:text-orange-400',
    purple:
      variant === 'outline' || variant === 'link'
        ? 'text-purple-400'
        : 'text-white hover:text-purple-400',
    teal:
      variant === 'outline' || variant === 'link'
        ? 'text-teal-400'
        : 'text-white hover:text-teal-400',
    red:
      variant === 'outline' || variant === 'link'
        ? 'text-red-400'
        : 'text-white hover:text-red-400',
    yellow:
      variant === 'outline' || variant === 'link'
        ? 'text-yellow-400'
        : 'text-white hover:text-yellow-400',
    blue:
      variant === 'outline' || variant === 'link'
        ? 'text-blue-400'
        : 'text-white hover:text-blue-400',
  };

  const isRounded = rounded && 'rounded-full';
  const isFull = full && 'w-full';

  const solidColors = {
    orange: 'bg-orange-400 border-orange-400 hover:bg-orange-100',
    purple: 'bg-purple-400 border-purple-400 hover:bg-purple-100',
    teal: 'bg-teal-400 border-teal-400 hover:bg-teal-100',
    red: 'bg-red-400 border-red-400 hover:bg-red-100',
    yellow: 'bg-yellow-400 border-yellow-400 hover:bg-yellow-100',
    blue: 'bg-blue-400 border-blue-400 hover:bg-blue-100',
  };

  const outlineColors = {
    orange: 'bg-transparent hover:bg-orange-400 border border-orange-400',
    purple: 'bg-transparent hover:bg-purple-400 border border-purple-400',
    teal: 'bg-transparent hover:bg-teal-400 border border-teal-400',
    red: 'bg-transparent hover:bg-red-400 border border-red-400',
    yellow: 'bg-transparent hover:bg-yellow-400 border border-yellow-400',
    blue: 'bg-transparent hover:bg-blue-400 border border-blue-400',
  };

  const linkColors = {
    orange:
      'bg-transparent bg-orange-100 border border-transparent hover:border-orange-400',
    purple:
      'bg-transparent bg-purple-100 border border-transparent hover:border-purple-400',
    teal: 'bg-transparent bg-teal-100 border border-transparent hover:border-teal-400',
    red: 'bg-transparent bg-red-100 border border-transparent hover:border-red-400',
    yellow:
      'bg-transparent bg-yellow-100 border border-transparent hover:border-yellow-400',
    blue: 'bg-transparent bg-blue-100 border border-transparent hover:border-blue-400',
  };

  const flexClasses = `flex flex-row ${
    secondText ? 'justify-around' : 'justify-center'
  } items-center gap-2`;

  const variants = {
    solid: props.disabled
      ? 'bg-gray-200 text-gray-400 hover:text-gray-400'
      : solidColors[color],
    outline: props.disabled
      ? 'bg-gray-200 text-gray-400 hover:text-gray-400'
      : outlineColors[color],
    link: props.disabled
      ? 'bg-gray-200 text-gray-400 hover:text-gray-400'
      : linkColors[color],
  };

  const classes = cn(
    'font-normal transition-colors border rounded',
    sizes[size],
    variants[variant],
    isRounded,
    isFull,
    className
  );

  return (
    <button
      type={type}
      className={`${classes} ${flexClasses} ${textColors[color]}`}
      {...props}>
      <Show condition={prefix}>
        <span className="flex items-center">{prefix}</span>
      </Show>
      <span className={`w-full ${flexClasses}`}>
        <ShowAdvanced
          condition={loading}
          conditionTrue={
            <span className="flex items-center animate-pulse">
              <EllipsisVerticalIcon className="w-6 h-6" />
            </span>
          }
          conditionFalse={
            <>
              <span>{children}</span>
              <Show condition={Boolean(secondText)}>
                <span>{secondText}</span>
              </Show>
            </>
          }
        />
      </span>
      <Show condition={suffix}>
        <span className="flex items-center">{suffix}</span>
      </Show>
    </button>
  );
};

export default Button;
