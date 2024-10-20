import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  MouseEventHandler,
} from 'react';

type InputLeadingProps = {
  label: string;
  error?: string;
  onSubmit?: MouseEventHandler;
  submitLabel?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const LeadingAny = forwardRef<
  HTMLInputElement | null,
  InputLeadingProps
>(({ label, error, children, onSubmit, submitLabel, disabled }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="relative sm:col-span-6">
        <div className="flex rounded-md border-r-2 border-gray-600 shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 py-3 text-gray-700 sm:text-sm lg:min-w-[20ch]">
            {label}
          </span>
          {children}
        </div>
        {onSubmit ? (
          <div className="right-0 top-0 m-auto sm:col-span-6 lg:absolute">
            <button
              disabled={disabled}
              className="btn-outline !px-6 !text-sm lg:!py-[12px]"
              onClick={onSubmit}
            >
              {submitLabel || 'Add'}
            </button>
          </div>
        ) : null}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
});
