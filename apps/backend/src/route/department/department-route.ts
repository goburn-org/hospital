import {
  createDepartmentSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { departmentService } from '../../service/department-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/department';

route.post(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const body = createDepartmentSchema.parse(req.body);
    const user = useAuthUser();
    const data = await departmentService.create({
      ...body,
      hospitalId: user.hospitalId,
    });
    res.send(data);
  }),
);

route.put(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = createDepartmentSchema.parse(req.body);
    const id = Number(req.params.id);
    const data = await departmentService.update({ ...body, id });
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    console.log('req.query', req.query);
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const data = await departmentService.getAll({
      hospitalId: user.hospitalId,
      options: {
        paginate: req.query.paginate,
        sort: req.query.sort,
        search: req.query.search,
      },
    });
    return res.send(data);
  }),
);

route.get(
  `${baseVersion}/departments`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    const data = await departmentService.getAll({
      hospitalId: user.hospitalId,
    });
    return res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await departmentService.getById(id);
    return res.send(data);
  }),
);

export default [route];
