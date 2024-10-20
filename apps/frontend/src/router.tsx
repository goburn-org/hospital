import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { routerConfig } from './utils/constants';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" lazy={() => import('./routes/login')} />
      <Route path="/" lazy={() => import('./routes/entry-point')}>
        <Route
          path={routerConfig.UserRoute}
          lazy={() => import('./routes/user')}
        >
          <Route
            path={routerConfig.Role}
            lazy={() => import('./routes/role/role')}
          >
            <Route
              path={routerConfig.New}
              lazy={() => import('./routes/role/new')}
            />
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
