import { PlusCircleIcon } from '@heroicons/react/20/solid';

export const PageSubHeader = ({
  title,
  description,
  newButton,
}: {
  title: string;
  description?: string;
  newButton?: {
    label: string;
    onClick: () => void;
  };
}) => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        ) : null}
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        {newButton ? (
          <button
            type="button"
            className="btn-primary"
            onClick={newButton.onClick}
          >
            <PlusCircleIcon width={24} /> {newButton.label}
          </button>
        ) : null}
      </div>
    </div>
  );
};
