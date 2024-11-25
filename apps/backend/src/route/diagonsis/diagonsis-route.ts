import { ensure, validatePaginateParams } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { diagnosisService } from '../../service/diagonsis-service';

const diagnosisRoute = Router();
const baseVersion = '/v1';
const baseRoute = '/diagnosis';

diagnosisRoute.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    ensure(validatePaginateParams(req.query), 'Invalid sort params');
    const search = (req.query.search || '') as string;
    const data = await diagnosisService.get(search, req.query);
    res.json(data);
  }),
);

export default [diagnosisRoute];
