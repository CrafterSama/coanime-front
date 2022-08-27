import { FC } from 'react';

import { PencilIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { RoundedButton } from '@/components/ui/RoundedButton';
import { CgSpinner } from 'react-icons/cg';

type FormHeaderProps = {
  title: string;
  subtitle?: string;
  cancelAction?: () => void;
  editAction?: () => void;
  disabled?: boolean;
  primaryActionText?: string;
  secondaryActionText?: string;
  isSaving?: boolean;
};

const FormHeader: FC<FormHeaderProps> = ({
  title,
  subtitle = '',
  cancelAction = () => {},
  editAction = () => {},
  disabled = false,
  primaryActionText = 'Guardar',
  secondaryActionText = 'Cancelar',
  isSaving = false,
}) => {
  return (
    <header className="flex flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg sticky top-0 z-5">
      <h3 className="w-3/4 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-start items-center">
        {title} {subtitle && `| ${subtitle}`}
      </h3>
      <div className="action-buttons w-1/4 flex flex-row gap-4 justify-end">
        {isSaving && (
          <CgSpinner className="w-5 h-5 animate-spin" color="gray" size={20} />
        )}
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
