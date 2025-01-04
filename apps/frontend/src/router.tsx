import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { DentalAssessment } from './features/patient/dental-assessment';
import { routerConfig } from './utils/constants';

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

const accountRoutes = (
  <Route
    path={routerConfig.Accounts}
    lazy={() => import('./routes/bank-account')}
  >
    <Route
      path={routerConfig.New}
      lazy={() => import('./routes/bank-account/new')}
    />
    <Route
      path={`${routerConfig.View}/:id`}
      lazy={() => import('./routes/bank-account/view')}
    />
    <Route
      path={`${routerConfig.Edit}/:id`}
      lazy={() => import('./routes/bank-account/edit')}
    />
  </Route>
);

const settingRoutes = (
  <Route
    path={routerConfig.SettingRoute}
    lazy={() => import('./routes/user-management')}
  >
    {inventoryRoutes}
    {accountRoutes}
    <Route
      path={routerConfig.UiConfig}
      lazy={() => import('./routes/ui-config/ui-config')}
    />
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
    <Route
      path={`/${routerConfig.Patient}/:patientId/${routerConfig.Visit}/:visitId/${routerConfig.Edit}`}
      lazy={() => import('./routes/patient/edit-visit')}
    />
  </>
);

const billingRoutes = (
  <>
    <Route path={routerConfig.Billing} lazy={() => import('./routes/billing')}>
      <Route
        path={`${routerConfig.Close}/:patientId/:visitId`}
        lazy={() => import('./routes/billing/close-billing')}
      />
      <Route
        path={`:patientId/:visitId`}
        lazy={() => import('./routes/billing/edit')}
      />
    </Route>
    <Route
      path={`${routerConfig.Billing}/${routerConfig.Report}`}
      lazy={() => import('./routes/billing/report')}
    >
      <Route
        path={`:patientId`}
        lazy={() => import('./routes/billing/report/by-visit-id')}
      />
      <Route
        path={`:patientId/:visitId`}
        lazy={() => import('./routes/billing/edit')}
      />
    </Route>
  </>
);

const dashboardRoute = (
  <Route
    path={routerConfig.DashboardRoute}
    lazy={() => import('./routes/dashboard')}
  />
);

const pharmacyRoutes = (
  <Route path={routerConfig.Pharmacy} lazy={() => import('./routes/pharmacy')}>
    <Route
      path={routerConfig.New}
      lazy={() => import('./routes/pharmacy/new')}
    />
    <Route
      path={`${routerConfig.View}/:id`}
      lazy={() => import('./routes/pharmacy/view')}
    />
    <Route
      path={`${routerConfig.Edit}/:id`}
      lazy={() => import('./routes/pharmacy/edit')}
    />
  </Route>
);

const grnRoutes = (
  <Route path={routerConfig.Grn} lazy={() => import('./routes/grn')}>
    <Route path={routerConfig.New} lazy={() => import('./routes/grn/new')} />
    <Route
      path={`${routerConfig.View}/:id`}
      lazy={() => import('./routes/grn/view')}
    />
    <Route
      path={`${routerConfig.Edit}/:id`}
      lazy={() => import('./routes/pharmacy/edit')}
    />
  </Route>
);

const intentRoutes = (
  <Route path={routerConfig.Intent} lazy={() => import('./routes/intent')}>
    <Route path={routerConfig.New} lazy={() => import('./routes/intent/new')} />
    <Route
      path={routerConfig.View}
      lazy={() => import('./routes/intent/new')}
    />
  </Route>
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" lazy={() => import('./routes/login')} />
      <Route path="/" lazy={() => import('./routes/entry-point')}>
        {dashboardRoute}
        {settingRoutes}
        {patientRoutes}
        {billingRoutes}
        {pharmacyRoutes}
        {grnRoutes}
        {intentRoutes}
      </Route>
      <Route path="/dental-assessment" element={<DentalAssessment />} />
    </Route>,
  ),
);
