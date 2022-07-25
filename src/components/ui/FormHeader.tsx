import { FC } from 'react';

import { PencilIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { RoundedButton } from '@/components/ui/RoundedButton';

type FormHeaderProps = {
  title: string;
  subtitle?: string;
  cancelAction?: () => void;
  editAction?: () => void;
  disabled?: boolean;
  primaryActionText?: string;
  secondaryActionText?: string;
};

const FormHeader: FC<FormHeaderProps> = ({
  title,
  subtitle,
  cancelAction,
  editAction,
  disabled,
  primaryActionText = 'Guardar',
  secondaryActionText = 'Cancelar',
}) => {
  return (
    <header className="flex flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg sticky top-0 z-10">
      <h3 className="w-1/2 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-start items-center">
        {title} {subtitle && `| ${subtitle}`}
      </h3>
      <div className="action-buttons w-1/2 flex flex-row gap-4 justify-end">
        {disabled ? (
          <RoundedButton onClick={editAction}>
            <PencilIcon className="w-6 h-6" />
          </RoundedButton>
        ) : (
          <>
            <Button type="button" variant="text" onClick={cancelAction}>
              {secondaryActionText}
            </Button>
            <Button type="submit">{primaryActionText}</Button>
          </>
        )}
      </div>
    </header>
  );
};

export default FormHeader;
