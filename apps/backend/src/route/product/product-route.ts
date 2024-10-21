import {
  createProductSchema,
  ensure,
  updateProductSchema,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { productService } from '../../service/product-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/product';

route.post(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const body = createProductSchema.parse(req.body);
    const data = await productService.create(body);
    res.send(data);
  }),
);

route.put(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = updateProductSchema.parse(req.body);
    const data = await productService.update({ ...body, id: req.params.id });
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const data = await productService.getAll({
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
    const data = await productService.getById(req.params.id);
    return res.send(data);
  }),
);

export default [route];
