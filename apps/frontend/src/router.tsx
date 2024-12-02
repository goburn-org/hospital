import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { routerConfig } from './utils/constants';

const settingRoutes = (
  <Route
    path={routerConfig.SettingRoute}
    lazy={() => import('./routes/user-management')}
  >
    <Route path={routerConfig.Role} lazy={() => import('./routes/role/role')}>
      <Route path={routerConfig.New} lazy={() => import('./routes/role/new')} />
      <Route
        path={`${routerConfig.View}/:id`}
        lazy={() => import('./routes/role/view')}
      />
      <Route
        path={`${routerConfig.Edit}/:id`}
        lazy={() => import('./routes/role/edit')}
      />
    </Route>

    <Route
      path={routerConfig.Department}
      lazy={() => import('./routes/department/department')}
    >
      <Route
        path={routerConfig.New}
        lazy={() => import('./routes/department/new')}
      />
      <Route
        path={`${routerConfig.View}/:id`}
        lazy={() => import('./routes/department/view')}
      />
      <Route
        path={`${routerConfig.Edit}/:id`}
        lazy={() => import('./routes/department/edit')}
      />
    </Route>

    <Route
      path={routerConfig.Employee}
      lazy={() => import('./routes/employee/employee')}
    >
      <Route
        path={routerConfig.New}
        lazy={() => import('./routes/employee/new')}
      />
      <Route
        path={`${routerConfig.View}/:id`}
        lazy={() => import('./routes/employee/view')}
      />
      <Route
        path={`${routerConfig.Edit}/:id`}
        lazy={() => import('./routes/employee/edit')}
      />
    </Route>
  </Route>
);

const inventoryRoutes = (
  <Route path={routerConfig.Inventory} lazy={() => import('./routes/product')}>
    <Route
      path={routerConfig.New}
      lazy={() => import('./routes/product/new')}
    />
    <Route
      path={`${routerConfig.View}/:id`}
      lazy={() => import('./routes/product/view')}
    />
    <Route
      path={`${routerConfig.Edit}/:id`}
      lazy={() => import('./routes/product/edit')}
    />
  </Route>
);

const patientRoutes = (
  <>
    <Route path={routerConfig.Patient} lazy={() => import('./routes/patient')}>
      <Route
        path={routerConfig.New}
        lazy={() => import('./routes/patient/new')}
      />
      <Route path={`:patientId`} lazy={() => import('./routes/patient/edit')} />
      <Route
        path={`:patientId/${routerConfig.Visit}/${routerConfig.New}`}
        lazy={() => import('./routes/patient/new-visit')}
      />
    </Route>
    <Route
      path={`/${routerConfig.Patient}/:patientId/${routerConfig.Visit}/:visitId`}
      lazy={() => import('./routes/patient/visit-details')}
    >
      <Route
        path={routerConfig.Checkout}
        lazy={() => import('./routes/patient/checkout')}
      />
    </Route>
  </>
);

const billingRoutes = (
  <Route path={routerConfig.Billing} lazy={() => import('./routes/billing')}>
    <Route
      path={`:patientId/:visitId`}
      lazy={() => import('./routes/billing/edit')}
    />
    <Route
      path={routerConfig.Report}
      lazy={() => import('./routes/billing/new-visit')}
    />
  </Route>
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" lazy={() => import('./routes/login')} />
      <Route path="/" lazy={() => import('./routes/entry-point')}>
        {settingRoutes}
        {inventoryRoutes}
        {patientRoutes}
        {billingRoutes}
      </Route>
    </Route>,
  ),
);
