import { CgSpinner } from 'react-icons/cg';

import { PencilIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Errors from '@/components/ui/errors';
import { RoundedButton } from '@/components/ui/rounded-button';

type FormHeaderProps = {
  title: string;
  subtitle?: string;
  cancelAction?: () => void;
  editAction?: () => void;
  disabled?: boolean;
  primaryActionText?: string;
  secondaryActionText?: string;
  isSaving?: boolean;
  overAll?: boolean;
  errors?: any;
  errorsKey?: string;
};

const FormHeader = ({
  title,
  subtitle = '',
  cancelAction = () => {
    //
  },
  editAction = () => {
    //
  },
  disabled = false,
  primaryActionText = 'Guardar',
  secondaryActionText = 'Cancelar',
  isSaving = false,
  overAll = true,
  errors = {},
}: FormHeaderProps) => {
  return (
    <header
      className={`flex flex-col md:flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg sticky top-0 ${
        overAll && 'z-20'
      }`}>
      <h3 className="w-full md:w-3/4 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-center md:justify-start items-center mb-4 md:mb-0">
        {title} {subtitle && `| ${subtitle}`}
      </h3>
      <Errors errors={errors} />
      <div className="action-buttons w-full md:w-1/4 flex flex-row gap-4 justify-end">
        {isSaving && (
          <CgSpinner className="w-5 h-5 animate-spin" color="gray" size={20} />
        )}
        {disabled ? (
          <RoundedButton onClick={editAction}>
            <PencilIcon className="w-6 h-6" />
          </RoundedButton>
        ) : (
          <>
            <Button type="button" variant="link" onClick={cancelAction}>
              {secondaryActionText}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {primaryActionText}
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default FormHeader;
