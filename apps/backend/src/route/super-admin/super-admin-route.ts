import {
  ensure,
  HospitalCreateInputSchema,
  UserCreateInputSchema,
} from '@hospital/shared';
import { Router } from 'express';
import { superAdminMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { hospitalService } from '../../service/hospital-service';
import { userService } from '../../service/user-service';
import { dbClient } from '../../prisma';
import { setAuthUser } from '../../provider/async-context';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/super-admin';

route.post(
  `${baseVersion}${baseRoute}/hospital`,
  superAdminMiddleware,
  errorHandler(async (req, res) => {
    const hospitalInput = HospitalCreateInputSchema.parse(req.body.hospital);
    console.log('Hospital Input', hospitalInput);
    ensure(req.body.role.roleName, 'Role Name is required');
    ensure(req.body.department.name, 'Department Name is required');
    ensure(req.body.password, 'Password is required');
    const userInput = req.body.user;
    const hospital = await hospitalService.create(hospitalInput);
    const role = await dbClient.role.create({
      data: {
        roleName: req.body.role.roleName,
        hospitalId: hospital.id,
        isSuperAdmin: true,
      },
    });
    const department = await dbClient.department.create({
      data: {
        name: req.body.department.name,
        hospitalId: hospital.id,
        roleId: role.id,
      },
    });

    const user = await dbClient.user.create({
      data: {
        email: userInput.email,
        name: userInput.name,
        phoneNumber: userInput.phoneNumber,
        hospitalId: hospital.id,
        department: department.id,
      },
      include: {
        Department: true,
        UserRole: true,
        Hospital: true,
      },
    });
    setAuthUser(user);
    await userService.upsertPassword(user, req.body.password);
    res.json({
      hospital,
      role,
      department,
      user,
    });
  }),
);

export default [route];
