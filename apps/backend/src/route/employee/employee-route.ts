import {
  createEmployeeSchema,
  ensure,
  updateEmployeeSchema,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { employeeService } from '../../service/employee-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/employee';

route.post(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const body = createEmployeeSchema.parse(req.body);
    const data = await employeeService.create(body);
    res.send(data);
  }),
);

route.put(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = updateEmployeeSchema.parse(req.body);
    const data = await employeeService.update({ ...body, id: req.params.id });
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const empIds = req.query.empIds;
    if (empIds) {
      ensure(Array.isArray(empIds), 'empIds must be an array');
      ensure(empIds.length > 0, 'empIds must not be empty');
      ensure(
        empIds.every((id) => typeof id === 'string'),
        'empIds must be an array of string',
      );
      const data = await employeeService.getByIds(empIds);
      return res.send(data);
    }
    const user = useAuthUser();
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const data = await employeeService.getAll({
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
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await employeeService.getById(req.params.id);
    return res.send(data);
  }),
);

export default [route];
