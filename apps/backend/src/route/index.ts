import authRoute from './auth/auth-route';
import departmentRoute from './department/department-route';
import employeeRoute from './employee/employee-route';
import healthRoute from './health/health-route';
import patientRoute from './patient/patient-route';
import productRoute from './product/product-route';
import route from './role/role-route';

export default [
  ...healthRoute,
  ...route,
  ...authRoute,
  ...departmentRoute,
  ...employeeRoute,
  ...productRoute,
  ...patientRoute,
];
