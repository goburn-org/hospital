import { Router } from 'express';
import { errorHandler } from '../../middleware/error-middleware';
import { dbClient } from '../../prisma';

const healthRoute = Router();
const baseVersion = '/v1';
const baseRoute = '/health';

const isDbOk = async () => {
  try {
    await dbClient.user.findFirst();
    return true;
  } catch {
    return false;
  }
};

healthRoute.get(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const isDbConnected = await isDbOk();
    res.send({
      status: 'ok',
      db: isDbConnected,
    });
  }),
);

export default [healthRoute];
