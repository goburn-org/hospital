import {
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateDepartmentInput,
} from '@hospital/shared';
import { Department, Prisma } from '@prisma/client';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class DepartmentService {
  create(data: Prisma.DepartmentUncheckedCreateInput) {
    const user = useAuthUser();
    return dbClient.department.create({
      data: {
        ...data,
        updatedBy: user.id,
      },
    });
  }

  update(data: UpdateDepartmentInput) {
    const user = useAuthUser();
    return dbClient.department.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
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
  }): Promise<PaginatedResponse<Department>> {
    const { paginate, sort } = options;
    const data = await dbClient.department.findMany({
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
    const total = await dbClient.department.count({
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
    return dbClient.department.findUnique({
      where: {
        id,
      },
    });
  }
}

export const departmentService = new DepartmentService();
