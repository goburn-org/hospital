import {
  DepartmentResponse,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateDepartmentInput,
} from '@hospital/shared';
import { Prisma } from '@prisma/client';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class DepartmentService {
  create(
    data: Prisma.DepartmentUncheckedCreateInput,
  ): Promise<DepartmentResponse> {
    const user = useAuthUser();
    return dbClient.department.create({
      data: {
        ...data,
        updatedBy: user.id,
      },
      include: {
        Role: true,
      },
    });
  }

  update(data: UpdateDepartmentInput): Promise<DepartmentResponse> {
    const user = useAuthUser();
    return dbClient.department.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        updatedBy: user.id,
      },
      include: {
        Role: true,
      },
    });
  }

  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options?: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<DepartmentResponse>> {
    const { paginate, sort } = options || {};
    const data = await dbClient.department.findMany({
      where: {
        hospitalId,
      },
      include: {
        Role: true,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
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
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  getById(id: number): Promise<DepartmentResponse | null> {
    return dbClient.department.findUnique({
      where: {
        id,
      },
      include: {
        Role: true,
      },
    });
  }
}

export const departmentService = new DepartmentService();
