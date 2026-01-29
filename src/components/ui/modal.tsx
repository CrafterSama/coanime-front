import { ReactElement, ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  title: string;
  children: ReactNode;
};

const Modal = ({
  isOpen,
  toggleModal,
  title,
  children,
}: ModalProps): ReactElement => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium leading-6 text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
