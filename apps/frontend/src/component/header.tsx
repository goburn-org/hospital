import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Sidebar } from './sidebar';
import { useParam } from '../utils/use-param';
import { useEffect, useRef, useState } from 'react';
import { apiTokenStorage } from '../provider/auth/auth-util';
import { useNavigate } from 'react-router-dom';
import { HttpService } from '../utils/http';
import { useUserQuery } from './user-query';

const placeHolders = [
  'Search...',
  'Search for Projects...',
  'Search for Users...',
  'Search by Email...',
  'Search by Name...',
];

export const Header = () => {
  const { param, updateParam, removeParam } = useParam<'q' | 'status'>();
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const search = param.q;
  const updateSearch = (value: string) => {
    if (value === '') {
      removeParam('q');
      return;
    }
    updateParam('q', value);
  };
  const [searchPlaceholder, setSearchPlaceholder] = useState(placeHolders[0]);
  const modifierKey = navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl';
  useEffect(() => {
    const id = setInterval(() => {
      setSearchPlaceholder(
        placeHolders[Math.floor(Math.random() * placeHolders.length)],
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleTilt = (event: KeyboardEvent) => {
      const modifier = navigator.userAgent.includes('Mac')
        ? event.metaKey
        : event.ctrlKey;
      if (event.key === 'k' && modifier) {
        ref.current?.focus();
      }
    };
    document.addEventListener('keydown', handleTilt);
    return () => {
      document.removeEventListener('keydown', handleTilt);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-violet-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 2xl:px-8">
      <button
        type="button"
        onClick={() => Sidebar.open()}
        className="-m-2.5 p-2.5 text-gray-700 2xl:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 2xl:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch 2xl:gap-x-6">
        <div className="flex w-full items-center justify-center">
          <form className="relative flex w-full items-center">
            <input
              ref={ref}
              type="text"
              placeholder={` Tap ${modifierKey} + K to start search              ${searchPlaceholder}`}
              value={search || ''}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-x-4 2xl:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="2xl:h-6 2xl:w-px 2xl:bg-gray-900/10"
          />

          {/* Profile dropdown */}
          {/* eslint-disable-next-line no-constant-condition */}
          {false ? (
            <div className="flex animate-pulse space-x-4">
              <div className="h-10 w-10 rounded-full bg-slate-700"></div>
            </div>
          ) : (
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>

                <span className="flex 2xl:items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary p-5 text-base font-bold text-white">
                    {user?.name?.[0].toUpperCase()}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900 whitespace-nowrap"
                  >
                    {user?.name}
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 flex w-64 origin-top-right flex-col items-start gap-3 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <button className="btn-text btn-text-secondary !items-center !justify-center !text-center">
                    <span className="text-gray-400">Department:</span>
                    {user?.Department?.name}
                  </button>
                </MenuItem>
                <span className="h-1 w-2/3 self-center rounded-3xl bg-gray-200"></span>
                <MenuItem>
                  <button
                    className="btn-text w-full !items-center !justify-center !text-center"
                    onClick={() => {
                      apiTokenStorage.removeToken();
                      HttpService.removeToken();
                      navigate('/login');
                    }}
                  >
                    <ArrowLeftStartOnRectangleIcon color="black" height={24} />
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};
