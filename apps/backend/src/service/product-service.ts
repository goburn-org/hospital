import {
  CreateProductInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  ProductResponse,
  UpdateProductInput,
} from '@hospital/shared';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class ProductService {
  async create(data: CreateProductInput): Promise<ProductResponse> {
    const authUser = useAuthUser();
    return dbClient.product.create({
      data: {
        brandName: data.brandName,
        genericName: data.genericName,
        dosageForm: data.dosageForm,
        hsnCode: data.hsnCode,
        manufacturer: data.manufacturer,
        maxDiscount: data.maxDiscount,
        mrp: data.mrp,
        name: data.name,
        purchaseRate: data.purchaseRate,
        saleRate: data.saleRate,
        sku: data.sku,
        strength: data.strength,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
        taxCodeId: data.taxCodeId,
        Department: {
          connect: data.departmentIds.map((departmentId) => ({
            id: departmentId,
          })),
        },
      },
      include: {
        Department: true,
      },
    });
  }

  async update(data: UpdateProductInput): Promise<ProductResponse> {
    const { departmentIds, id, ...rest } = data;
    return dbClient.product.update({
      where: {
        id,
      },
      data: {
        ...rest,
        updatedBy: useAuthUser().id,
        Department: {
          set: departmentIds.map((departmentId) => ({
            id: departmentId,
          })),
        },
      },
      include: {
        Department: true,
      },
    });
  }

  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options?: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<ProductResponse>> {
    const { paginate, sort } = options || {};
    const data = await dbClient.product.findMany({
      where: {
        hospitalId,
        OR: [
          {
            name: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
          {
            brandName: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
          {
            genericName: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
        ],
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
    const total = await dbClient.product.count({
      where: {
        hospitalId,
        OR: [
          {
            name: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
          {
            brandName: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
          {
            genericName: {
              contains: options?.search ?? '',
              mode: 'insensitive',
            },
          },
        ],
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

  getById(id: string): Promise<ProductResponse | null> {
    return dbClient.product.findUnique({
      where: {
        id,
      },
      include: {
        Department: true,
      },
    });
  }
}

export const productService = new ProductService();
