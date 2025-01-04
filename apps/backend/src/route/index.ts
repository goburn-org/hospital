import accountConfigRoute from './account-config/account-config-route';
import authRoute from './auth/auth-route';
import bankAccountRoute from './bank-account/bank-account-route';
import departmentRoute from './department/department-route';
import employeeRoute from './employee/employee-route';
import healthRoute from './health/health-route';
import intentRoute from './intent/intent-route';
import orderRoute from './order/order-route';
import patientBillingRoute from './patient/patient-billing-route';
import patientReceiptRoute from './patient/patient-receipt-route';
import patientRoute from './patient/patient-route';
import patientVisitRoute from './patient/patient-visit-route';
import pharmacyRoute from './pharmacy/pharmacy-route';
import productRoute from './product/product-route';
import reportRoute from './report/report-route';
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
  ...reportRoute,
  ...bankAccountRoute,
  ...orderRoute,
  ...pharmacyRoute,
  ...intentRoute,
];
