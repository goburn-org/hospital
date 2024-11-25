import { Outlet } from 'react-router-dom';
import { Header } from '../component/header';
import { Sidebar } from '../component/sidebar';
import { useRedirectIfNotAuthenticated } from '../component/user-query';

export function Component() {
  useRedirectIfNotAuthenticated();
  return (
    <div>
      <Sidebar />
      <div className="sm:pl-20">
        <Header />
        <main className="py-10">
          <div className="px-0 sm:px-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
