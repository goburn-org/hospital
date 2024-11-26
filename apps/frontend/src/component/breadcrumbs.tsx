import { HomeIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../utils/classNames';
import { routerConfig } from '../utils/constants';

type defaultProps = {
  pages: {
    name: string;
    href: string;
    current?: boolean;
  }[];
};

const Breadcrumbs: React.FC<defaultProps> = ({ pages }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex space-x-4 rounded-md bg-white px-6 shadow">
        <li className="flex">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate(`/${routerConfig.Patient}`);
              }}
              className="text-indigo-500 hover:text-indigo-700"
            >
              <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span className="sr-only">Home</span>
            </button>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                fill="currentColor"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-full w-6 flex-shrink-0 text-indigo-200"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <button
                onClick={() => {
                  navigate(`${page.href}`);
                }}
                aria-current={page.current ? 'page' : undefined}
                className={classNames(
                  page.current
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-indigo-500 hover:text-indigo-700',
                  'ml-4 text-sm font-medium',
                )}
              >
                {page.name}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
