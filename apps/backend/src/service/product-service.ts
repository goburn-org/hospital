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
        ProductDepartment: {
          createMany: {
            data: data.departmentIds.map((departmentId) => ({
              departmentId,
            })),
          },
        },
        updatedBy: authUser.id,
      },
      include: {
        ProductDepartment: true,
      },
    });
  }

  async updateDepartment(productId: string, departmentIds: number[]) {
    const authUser = useAuthUser();
    await dbClient.productDepartment.deleteMany({
      where: {
        productId: productId,
      },
    });
    return await dbClient.productDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        departmentId,
        productId,
        updatedBy: authUser.id,
      })),
    });
  }

  async update(data: UpdateProductInput): Promise<ProductResponse> {
    const { departmentIds, id, ...rest } = data;
    await this.updateDepartment(id, departmentIds);
    return dbClient.product.update({
      where: {
        id,
      },
      data: {
        ...rest,
        updatedBy: useAuthUser().id,
      },
      include: {
        ProductDepartment: true,
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
      },
      include: {
        ProductDepartment: true,
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
        ProductDepartment: true,
      },
    });
  }
}

export const productService = new ProductService();
