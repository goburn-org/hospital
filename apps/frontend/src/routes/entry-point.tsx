import { Outlet } from 'react-router-dom';
import { Sidebar } from '../component/sidebar';
import { useRedirectIfNotAuthenticated } from '../component/user-query';

export function Component() {
  useRedirectIfNotAuthenticated();
  return (
    <div>
      <Sidebar />
      <div className="sm:pl-20">
        <Outlet />
      </div>
    </div>
  );
}
