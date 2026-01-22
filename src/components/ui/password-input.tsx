import * as React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { Input, type InputProps } from '@/components/ui/input';

export interface PasswordInputProps
  extends Omit<InputProps, 'type' | 'endIcon' | 'endIconAction'> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        endIcon={
          showPassword ? (
            <AiOutlineEyeInvisible size={24} />
          ) : (
            <AiOutlineEye size={24} />
          )
        }
        endIconAction={() => setShowPassword(!showPassword)}
      />
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
