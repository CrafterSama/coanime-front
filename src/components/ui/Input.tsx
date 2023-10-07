import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type ReactElement,
} from 'react';

import cn from 'classnames';

import Label from '@/components/ui/Label';

import { Show } from './Show';

type ExposedNativeInputProps =
  | 'autoComplete'
  | 'id'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'onKeyUp'
  | 'onKeyDown'
  | 'onKeyPress'
  | 'placeholder'
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'readOnly'
  | 'className'
  | 'onPaste'
  | 'required'
  | 'autoFocus';

export interface InputProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, ExposedNativeInputProps> {
  invalid?: boolean;
  label?: string;
  prefix?: string | ReactElement;
  suffix?: string | ReactElement;
  onSuffixClick?: () => void;
  suffixClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  accepts?: string[];
  endIcon?: ReactElement;
  endIconAction?: () => void;
  hint?: ReactElement | string;
  maxLength?: number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  lowerHint?: string | number;
  isValid?: boolean;
  className?: string;
  errors?: string;
  classNameContainer?: string;
  charactersCount?: number;
  withoutAppearance?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function InputWithRef(
    {
      type = 'text',
      invalid = false,
      label = '',
      prefix,
      suffix,
      accepts,
      autoComplete = 'on',
      suffixClassName,
      onSuffixClick,
      endIcon,
      endIconAction,
      hint,
      size = 'large',
      lowerHint,
      errors,
      classNameContainer,
      withoutAppearance: withoutAppearance = false,
      ...props
    },
    ref
  ) {
    const containerClassName = cn(
      {
        'overflow-hidden text-sm flex flex-row justify-stretch items-center border w-full text-sm rounded-md':
          true,
        'bg-white': !props.disabled,
        'border-gray-300': !invalid && !props.disabled,
        'focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-500':
          !invalid,
        'border-negative-400 focus-within:ring-4 focus-within:ring-negative-50':
          invalid,
        'bg-gray-200 border-gray-200 text-gray-500': props.disabled,
        'bg-gray-200': props.readOnly,
      },
      classNameContainer
    );

    const containerWithoutAppearanceClassName = cn({
      'overflow-hidden text-sm flex items-stretch w-full text-sm': true,
      'bg-white': !props.disabled,
    });

    const inputClassName = cn(
      'w-full bg-transparent focus:outline-none',
      {
        'py-3 px-6': size === 'large',
        'py-2 px-4': size === 'medium',
        'py-1 px-3': size === 'small',
        'text-gray-400': props.disabled,
      },
      props.className
    );

    return (
      <div className="w-full">
        <div className="flex flex-row justify-start items-center gap-1">
          <Show condition={Boolean(label)}>
            <Label htmlFor={props.name}>{label}</Label>
          </Show>
          <Show condition={Boolean(hint)}>
            <div className="flex items-center text-[.7rem]">{hint}</div>
          </Show>
        </div>
        <div
          className={
            !withoutAppearance
              ? containerClassName
              : containerWithoutAppearanceClassName
          }>
          <Show condition={Boolean(prefix)}>
            <div className="py-0 pl-4 text-gray-400">{prefix}</div>
          </Show>
          <div className="flex-1 w-full">
            <input
              type={type}
              autoComplete={autoComplete}
              accept={accepts?.join(',')}
              {...props}
              ref={ref}
              className={inputClassName}
            />
          </div>
          <Show condition={typeof suffix === 'string'}>
            <div
              className={cn({
                'bg-white pr-4 py-4 text-gray-400': true,
                'bg-gray-200 border-gray-200 text-gray-500': props.disabled,
                'bg-gray-200': props.readOnly,
                [suffixClassName]: !!suffixClassName,
              })}
              onClick={onSuffixClick}>
              {suffix}
            </div>
          </Show>

          <Show condition={suffix && typeof suffix !== 'string'}>{suffix}</Show>

          <Show condition={Boolean(endIcon)}>
            <button
              type="button"
              onClick={endIconAction}
              className="px-2.5 focus:outline-none">
              {endIcon}
            </button>
          </Show>
        </div>
        <div className="flex flex-row gap-4">
          <Show condition={Boolean(lowerHint)}>
            <div className="text-xs text-gray-400">{lowerHint}</div>
          </Show>
          <Show condition={Boolean(errors)}>
            <div className="text-xs text-gray-400">{errors}</div>
          </Show>
        </div>
      </div>
    );
  }
);
