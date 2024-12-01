import accountConfigRoute from './account-config/account-config-route';
import authRoute from './auth/auth-route';
import departmentRoute from './department/department-route';
import employeeRoute from './employee/employee-route';
import healthRoute from './health/health-route';
import patientBillingRoute from './patient/patient-billing-route';
import patientReceiptRoute from './patient/patient-receipt-route';
import patientRoute from './patient/patient-route';
import patientVisitRoute from './patient/patient-visit-route';
import productRoute from './product/product-route';
import route from './role/role-route';
import superAdminRoute from './super-admin/super-admin-route';
import utilRoute from './util/util-route';

export default [
  ...healthRoute,
  ...route,
  ...authRoute,
  ...departmentRoute,
  ...employeeRoute,
  ...productRoute,
  ...patientRoute,
  ...superAdminRoute,
  ...accountConfigRoute,
  ...patientVisitRoute,
  ...utilRoute,
  ...patientBillingRoute,
  ...patientReceiptRoute,
];
