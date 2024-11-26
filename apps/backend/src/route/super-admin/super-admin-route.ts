import { ensure, hospitalCreateInputSchema } from '@hospital/shared';
import { Router } from 'express';
import { superAdminMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { dbClient } from '../../prisma';
import { setAuthUser } from '../../provider/async-context';
import { hospitalService } from '../../service/hospital-service';
import { userService } from '../../service/user-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/super-admin';

route.post(
  `${baseVersion}${baseRoute}/hospital`,
  superAdminMiddleware,
  errorHandler(async (req, res) => {
    const hospitalInput = hospitalCreateInputSchema.parse(req.body.hospital);
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

route.post(
  `${baseVersion}${baseRoute}/:hospitalId/order-department`,
  superAdminMiddleware,
  errorHandler(async (req, res) => {
    const hospitalId = Number(req.params.hospitalId);
    ensure(hospitalId, 'Hospital Id is required');
    const departmentNames = req.body.departmentNames;
    ensure(
      Array.isArray(departmentNames),
      'departmentNames should be an array',
    );
    ensure(departmentNames.length > 0, 'departmentNames should not be empty');
    ensure(
      departmentNames.every((d) => typeof d === 'string'),
      'departmentNames should be an array of strings',
    );
    const department = await dbClient.orderDepartment.createMany({
      data: departmentNames.map((name) => ({
        hospitalId,
        nane: name,
      })),
    });
    res.json(department);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/:hospitalId/order`,
  superAdminMiddleware,
  errorHandler(async (req, res) => {
    const hospitalId = Number(req.params.hospitalId);
    ensure(hospitalId, 'Hospital Id is required');
    const orders = req.body;
    ensure(Array.isArray(orders), 'req.body should be an array');
    ensure(orders.length > 0, 'req.body should not be empty');
    ensure(
      orders.every(
        (d) =>
          typeof d.orderDeptName === 'string' && typeof d.name === 'string',
      ),
      'Array should contain orderDeptName and name',
    );
    const uniqueDepartment = [...new Set(orders.map((o) => o.orderDeptName))];
    const departments = await dbClient.orderDepartment.findMany({
      where: {
        hospitalId,
      },
    });
    const departmentMap = uniqueDepartment.reduce(
      (acc, d) => {
        acc[d] = departments.find((dept) => dept.nane === d)?.id;
        return acc;
      },
      {} as Record<string, number>,
    );
    console.log('Department Map', departmentMap);

    const result = await dbClient.order.createMany({
      data: orders.map((o) => ({
        name: o.name,
        orderDeptId: departmentMap[o.orderDeptName],
        hospitalId,
      })),
    });
    return res.json(result);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/:hospitalId/product`,
  superAdminMiddleware,
  errorHandler(async (req, res) => {
    const hospitalId = Number(req.params.hospitalId);
    ensure(hospitalId, 'Hospital Id is required');
    const product = req.body;
    ensure(Array.isArray(product), 'req.body should be an array');
    const result = await dbClient.product.createMany({
      data: product.map((p) => ({
        ...p,
        hospitalId,
      })),
    });
    return res.json(result);
  }),
);

export default [route];
