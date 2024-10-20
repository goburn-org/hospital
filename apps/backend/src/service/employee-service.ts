import {
  CreateEmployeeInput,
  ensure,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateEmployeeInput,
} from '@hospital/shared';
import { User } from '@prisma/client';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';
import { userService } from './user-service';

class EmployeeService {
  async create(data: CreateEmployeeInput) {
    const authUser = useAuthUser();
    const user = await userService.createUser(
      {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        hospitalId: authUser.hospitalId,
        department: data.department,
      },
      data.password.newPassword,
    );
    if (data.roles) {
      return await this.updateRoles(user, data.roles);
    }
    return user;
  }

  async updateRoles(employee: User, roles: number[]) {
    const user = useAuthUser();
    await dbClient.userRole.deleteMany({
      where: {
        userId: employee.id,
      },
    });
    await dbClient.userRole.createMany({
      data: roles.map((roleId) => ({
        roleId,
        userId: employee.id,
        updatedBy: user.id,
      })),
    });
    return await userService.getUserById(user.id);
  }

  async update(data: UpdateEmployeeInput) {
    const authUser = useAuthUser();
    const user = await userService.getUserById(data.id);
    ensure(user, 'User not found');
    await userService.updateUser({
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      hospitalId: authUser.hospitalId,
      department: data.department,
      id: data.id,
    });
    if (data.roles) {
      return await this.updateRoles(user, data.roles);
    }
    return user;
  }

  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options?: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<User>> {
    const { paginate, sort } = options || {};
    const data = await dbClient.user.findMany({
      where: {
        hospitalId,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.user.count({
      where: {
        hospitalId,
      },
    });
    return {
      data,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  getById(id: string) {
    return userService.getUserById(id);
  }
}

export const employeeService = new EmployeeService();
