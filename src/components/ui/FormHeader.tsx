import { PencilIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { RoundedButton } from '@/components/ui/RoundedButton';

const FormHeader = ({ title, cancelAction, editAction, disabled }) => {
  return (
    <header className="flex flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg sticky top-0 z-10">
      <h4 className="w-1/2 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-start items-center">
        {title}
      </h4>
      <div className="action-buttons w-1/2 flex flex-row gap-4 justify-end">
        {disabled ? (
          <RoundedButton onClick={editAction}>
            <PencilIcon className="w-6 h-6" />
          </RoundedButton>
        ) : (
          <>
            <Button type="button" variant="text" onClick={cancelAction}>
              Cancel
            </Button>
            <Button type="submit">Guardar Post</Button>
          </>
        )}
      </div>
    </header>
  );
};

export default FormHeader;
