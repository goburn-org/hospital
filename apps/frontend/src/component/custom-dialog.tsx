import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { FC } from 'react';
import { classNames } from '../utils/classNames';

export const CustomDialog: FC<{
  open: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ open, children, className }) => {
  return (
    <Dialog open={open} onClose={() => null} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center lg:p-0 2xl:ml-[250px] 2xl:w-[80vw]">
          <DialogPanel
            transition
            className={classNames(
              className ? className : '',
              'relative max-h-[90vh] transform overflow-auto rounded-lg bg-gray-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in lg:my-8 lg:max-w-[80vw] lg:p-6 data-[closed]:lg:translate-y-0 data-[closed]:lg:scale-95',
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
