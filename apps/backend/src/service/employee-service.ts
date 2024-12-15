import {
  CreateEmployeeInput,
  ensure,
  Maybe,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateEmployeeInput,
} from '@hospital/shared';
import { Prisma, User } from '@prisma/client';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';
import { userService } from './user-service';

class EmployeeService {
  constructSearchQuery(search: Maybe<string>): Prisma.UserWhereInput {
    if (search) {
      return {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            phoneNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            Department: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }
    return {};
  }

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
    return user;
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
        ...this.constructSearchQuery(options?.search),
      },
      include: {
        Department: true,
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

  async getAllDoctor({ hospitalId }: { hospitalId: number }): Promise<User[]> {
    return dbClient.user.findMany({
      where: {
        hospitalId,
        Department: {
          Role: {
            roleType: 'DOCTOR',
          },
        },
      },
      include: {
        Department: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  getById(id: string) {
    return userService.getUserById(id);
  }
  getByIds(id: string[]) {
    const hospitalId = useAuthUser().hospitalId;
    return dbClient.user.findMany({
      where: {
        id: {
          in: id,
        },
        hospitalId,
      },
    });
  }
}

export const employeeService = new EmployeeService();
