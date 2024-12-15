import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';
import { ReactNode, useState } from 'react';
import { classNames } from '../../../utils/classNames';

export const DrawerSession = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const [expandedSession, setExpandedSession] = useState<boolean>(true);
  return (
    <div className="border-b">
      <button
        onClick={() => setExpandedSession(!expandedSession)}
        className="w-full text-left px-4 py-3 font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
      >
        <div className="flex w-full justify-between px-2">
          <p>{title}</p>
          {expandedSession ? (
            <ArrowUpCircleIcon className="h-5 w-5" />
          ) : (
            <ArrowDownCircleIcon className="h-5 w-5" />
          )}
        </div>
      </button>
      <div
        className={classNames(
          expandedSession ? 'block' : 'hidden',
          'transition-all duration-300',
        )}
      >
        {children}
      </div>
    </div>
  );
};
