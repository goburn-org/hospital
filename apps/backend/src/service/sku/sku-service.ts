import { CreateGrnRequest, GRN } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class SkuService {
  async create(data: CreateGrnRequest) {
    const user = useAuthUser();
    const productIdsMap = new Map<string, string>();
    const products = await dbClient.product.findMany({
      where: {
        name: {
          in: data.grnLineItem.map((d) => d.productId),
        },
      },
    });
    products.forEach((p) => {
      productIdsMap.set(p.name, p.id);
    });
    console.log(products.length);
    return await dbClient.sKU.createMany({
      data: data.grnLineItem.map((d) => ({
        batchNumber: d.batchNumber,
        expiryDate: d.expiryDate,
        hospitalId: user.hospitalId,
        mrp: d.mrp,
        productId: productIdsMap.get(d.productId)!,
        purchasePrice: d.costPrice,
        quantity: d.quantity,
        salePrice: d.sellPrice,
      })),
    });
  }

  async getAll(): Promise<GRN[]> {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    return dbClient.gRN.findMany({
      where: {
        hospitalId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const skuService = new SkuService();
