import authRoute from './auth/auth-route';
import healthRoute from './health/health-route';
import roleRoute from './role/role-route';

export default [...healthRoute, ...roleRoute, ...authRoute];
