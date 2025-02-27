import { userLoginSchema } from '@hospital/shared';
import { Router } from 'express';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { userService } from '../../service/user-service';

const authRoute = Router();
const baseVersion = '/v1';
const baseRoute = '/auth';

authRoute.post(
  `${baseVersion}${baseRoute}/login`,
  errorHandler(async (req, res) => {
    const userLoginInput = userLoginSchema.parse(req.body);
    const token = await userService.loginWithPassword(userLoginInput);
    res.send({
      token,
    });
    return;
  }),
);

authRoute.get(
  `${baseVersion}${baseRoute}`,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    res.send(user);
  }),
);

export default [authRoute];
