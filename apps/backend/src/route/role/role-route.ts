import { Router } from 'express';
import { errorHandler } from '../../middleware/error-middleware';
import { roleService } from '../../service/role-service';
import { authMiddleware } from '../../middleware/auth-middleware';
import { useAuthUser } from '../../provider/async-context';
import {
  createRoleSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';

const roleRoute = Router();
const baseVersion = '/v1';
const baseRoute = '/role';

roleRoute.post(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const roleInput = createRoleSchema.parse(req.body);
    const user = useAuthUser();
    const isDbConnected = await roleService.createRole({
      ...roleInput,
      hospitalId: user.hospitalId,
    });
    res.send({
      status: 'ok',
      db: isDbConnected,
    });
  }),
);

roleRoute.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    console.log('req.query', req.query);
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const role = await roleService.getRoles({
      hospitalId: user.hospitalId,
      options: {
        paginate: req.query.paginate,
        sort: req.query.sort,
        search: req.query.search,
      },
    });
    return res.send(role);
  }),
);

export default [roleRoute];
