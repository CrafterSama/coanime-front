import { Checkbox as CheckboxPrimitive } from './checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as React from 'react';

type CheckboxProps = {
  id: string;
  name?: string;
  text: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  defaultChecked?: boolean;
};

const Checkbox = ({
  id,
  name,
  text,
  checked,
  onCheckedChange,
  className,
  defaultChecked,
}: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked || false
  );

  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleCheckedChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  return (
    <div className={cn('inline-flex items-center space-x-2', className)}>
      <CheckboxPrimitive
        id={id}
        checked={currentChecked}
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor={id}
        className="text-sm text-gray-600 font-normal cursor-pointer">
        {text}
      </Label>
      {/* Input oculto para formularios HTML estándar que necesiten el name */}
      {name && (
        <input type="hidden" name={name} value={currentChecked ? '1' : '0'} />
      )}
    </div>
  );
};

export default Checkbox;
