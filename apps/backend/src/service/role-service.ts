import {
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateRoleInput,
} from '@hospital/shared';
import { Prisma, Role } from '@prisma/client';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class RoleService {
  create(role: Prisma.RoleUncheckedCreateInput) {
    const user = useAuthUser();
    return dbClient.role.create({
      data: {
        ...role,
        updatedBy: user.id,
      },
    });
  }

  update(role: UpdateRoleInput) {
    const user = useAuthUser();
    return dbClient.role.update({
      where: {
        id: role.id,
      },
      data: {
        ...role,
        updatedBy: user.id,
      },
    });
  }

  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<Role>> {
    const { paginate, sort } = options;
    const data = await dbClient.role.findMany({
      where: {
        hospitalId,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate.limit,
      skip: paginate.limit * (paginate.page - 1),
    });
    const total = await dbClient.role.count({
      where: {
        hospitalId,
      },
    });
    return {
      data,
      meta: {
        total,
        page: paginate.page,
        limit: paginate.limit,
      },
    };
  }

  getById(id: number) {
    return dbClient.role.findUnique({
      where: {
        id,
      },
    });
  }
}

export const roleService = new RoleService();
