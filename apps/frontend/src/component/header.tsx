import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountConfig } from '../provider/account/use-account-config';
import { apiTokenStorage } from '../provider/auth/auth-util';
import { useZoom } from '../provider/zoom-context';
import { routerConfig } from '../utils/constants';
import { HttpService } from '../utils/http';
import { useParam } from '../utils/use-param';
import { Sidebar } from './sidebar';
import { useUserQuery } from './user-query';

const placeHolders = [
  'Search...',
  'Search for Patient...',
  'Search for Users...',
  'Search by Email...',
  'Search by Name...',
];

const ProfileCard = () => {
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const { handleZoomIn, handleZoomOut, resetZoom, zoomLevel } = useZoom();
  const { data: account } = useAccountConfig();

  return (
    <div className="w-full overflow-hidden rounded-lg border pb-2 text-black">
      {/* Background Image */}
      <div className="relative h-36">
        <img
          className="h-full w-full bg-black object-contain"
          src={account?.hospitalImg}
          alt={account?.hospitalName}
        />
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
        <div className="absolute bottom-5 flex w-full translate-y-1/2 transform items-center justify-center">
          <UserIcon className="h-24 w-24 rounded-full bg-slate-300 p-5" />
        </div>
      </div>

      {/* Name and Info */}
      <div className="mt-8 px-4 text-center">
        <h2 className="text-base">{user?.name}</h2>
        <p className="text-xs capitalize text-gray-500">
          {user?.Department.name}
        </p>
      </div>
      <div className="m-auto my-2 h-1 w-2/3 rounded-3xl bg-gray-100"></div>
      <div className="flex flex-col my-8">
        <div className="flex justify-center w-full items-center">
          <button onClick={handleZoomOut} className="px-2 mr-2">
            <span role="img" aria-label="Zoom Out">
              🔍➖
            </span>
            <p className="text-xs text-gray-400">zoom Out</p>
          </button>
          <button
            className="text-sm text-white bg-blue-500 px-2 border border-black"
            onClick={resetZoom}
          >
            Reset
          </button>
          <button onClick={handleZoomIn} className="px-2 ml-2">
            <span role="img" aria-label="Zoom In">
              🔍➕
              <p className="text-xs text-gray-400">zoom In</p>
            </span>
          </button>
        </div>
      </div>

      <MenuItem>
        <button
          className="btn-text-secondary"
          onClick={() => {
            navigate(routerConfig.SettingRoute);
          }}
        >
          <Cog6ToothIcon height={24} />
          Settings
        </button>
      </MenuItem>

      <MenuItem>
        <button
          className="btn-text-secondary"
          onClick={() => {
            apiTokenStorage.removeToken();
            HttpService.removeToken();
            navigate('/login');
          }}
        >
          <ArrowLeftStartOnRectangleIcon height={24} />
          Logout
        </button>
      </MenuItem>
    </div>
  );
};

export const Header = () => {
  const { param, updateParam, removeParam } = useParam<'q' | 'status'>();
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
      if (event.key === 'f' && modifier) {
        event.preventDefault();
        event.stopPropagation();
        ref.current?.focus();
      }
    };
    document.addEventListener('keydown', handleTilt);
    return () => {
      document.removeEventListener('keydown', handleTilt);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-indigo-50 px-4 shadow-sm sm:gap-x-6 ">
      <button
        type="button"
        onClick={() => Sidebar.open()}
        className="ml-1.5 p-2.5 text-gray-700 "
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div aria-hidden="true" className="h-6 w-px bg-gray-900/10" />

      <div className="flex flex-1 gap-x-4 self-stretch 2xl:gap-x-6">
        <div className="flex w-full items-center justify-center">
          <form className="relative flex w-full items-center">
            <input
              ref={ref}
              type="text"
              placeholder={` Tap ${modifierKey} + f to start search              ${searchPlaceholder}`}
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
                <ProfileCard />
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};
