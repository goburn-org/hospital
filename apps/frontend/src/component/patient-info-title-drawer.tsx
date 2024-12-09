import { XMarkIcon } from '@heroicons/react/24/outline';
import { Maybe } from '@hospital/shared';

export const PatientInfoTitleDrawer = ({
  name,
  onClose,
  mobile,
  city,
}: {
  name: Maybe<string>;
  mobile: Maybe<string>;
  city: Maybe<string>;
  onClose: () => void;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col items-start mb-2">
        <h1 className="text-xl font-semibold capitalize text-gray-500">
          {name || 'Patient Name'}{' '}
        </h1>
        <div className="flex gap-1 items-center">
          <p className="text-gray-500">{mobile || ''}</p>
          <span className="rounded-full bg-gray-300 h-2 w-2" />
          <p className="text-gray-500">{city || ''}</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Close panel"
        className="btn-text btn-text-secondary"
        onClick={onClose}
      >
        <XMarkIcon className="h-8 w-8" />
      </button>
    </div>
  );
};
