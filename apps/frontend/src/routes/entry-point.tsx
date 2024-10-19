import { Outlet } from 'react-router-dom';
import { Header } from '../component/header';
import { Sidebar } from '../component/sidebar';

export function Component() {
  return (
    <div>
      <Sidebar />
      <div className="2xl:pl-64">
        <Header />
        <main className="py-10">
          <div className="px-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
