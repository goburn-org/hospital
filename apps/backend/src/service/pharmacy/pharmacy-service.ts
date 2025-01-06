import {
  CounterSaleAvailabilityInput,
  CounterSaleResponse,
  CreateCounterSaleBilInput,
  getToday,
  getYesterday,
  PaginatedResponse,
  PaginateParamsWithSort,
  StockAvailabilityResponse,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';
import { productService } from '../product-service';
import { taxCodeService } from '../tax-code-service';

class PharmacyService {
  async getAvailableStock(
    productId: string,
    requiredQuantity: number,
    hospitalId: number,
  ) {
    // Query SKUs for the given product, sorted by expiry date and quantity descending
    const skus = await dbClient.sKU.findMany({
      where: {
        productId,
        hospitalId,
      },
      orderBy: [
        { expiryDate: 'asc' }, // Earliest expiry date first
        { quantity: 'desc' }, // Highest quantity within the same expiry date
      ],
    });

    // Aggregate batches to meet the required quantity
    const selectedBatches: StockAvailabilityResponse['availableStock'][number]['sku'] =
      [];
    let totalQuantity = 0;

    for (const sku of skus) {
      const availableQuantity = Math.min(
        requiredQuantity - totalQuantity,
        sku.quantity,
      );
      selectedBatches.push({
        batchNumber: sku.batchNumber,
        quantity: availableQuantity,
        price: sku.salePrice,
      });
      totalQuantity += availableQuantity;

      if (totalQuantity >= requiredQuantity) break; // Stop when the required quantity is met
    }

    // If sufficient quantity is available, return the selected batches
    if (totalQuantity >= requiredQuantity) {
      return selectedBatches;
    }

    // If insufficient quantity, return what is available
    return {
      message: 'Insufficient stock available',
      selectedBatches,
      totalQuantity,
    };
  }
  async getAvailability(
    data: CounterSaleAvailabilityInput,
  ): Promise<StockAvailabilityResponse> {
    const user = useAuthUser();
    const availableStock: StockAvailabilityResponse['availableStock'] = [];
    const unAvailableStock: StockAvailabilityResponse['unAvailableStock'] = [];
    const hospitalId = user.hospitalId;
    await Promise.all(
      data.map(async (d) => {
        // Get available stock for each product
        const sku = await this.getAvailableStock(
          d.productId,
          d.quantity,
          hospitalId,
        );
        if ('message' in sku) {
          unAvailableStock.push({
            productId: d.productId,
            quantity: d.quantity,
            availableStock: sku.totalQuantity,
          });
          return;
        }
        availableStock.push({
          productId: d.productId,
          quantity: d.quantity,
          sku,
        });
      }),
    );
    const products = await productService.getIds(data.map((d) => d.productId));
    return {
      availableStock,
      unAvailableStock,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
      })),
    };
  }

  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<CounterSaleResponse>> {
    const { paginate, sort } = options || {};
    const yesterday = getYesterday();
    const today = getToday();
    const res = await dbClient.counterSale.findMany({
      where: {
        AND: [
          {
            updatedAt: {
              gte: yesterday,
              lte: today,
            },
          },
        ],
      },
      include: {
        CounterSaleBill: true,
        CounterItem: {
          include: {
            sku: true,
          },
        },
      },
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
      orderBy: {
        createdAt: sort?.order ?? 'desc',
      },
    });
    const total = await dbClient.patientPrescription.count({
      where: {
        updatedAt: {
          gte: yesterday,
          lte: today,
        },
        Visit: {
          Patient: {
            hospitalId,
          },
        },
      },
    });
    return {
      data: res,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async getAvailabilityWithBatchNumber(
    data: CreateCounterSaleBilInput['items'],
  ) {
    const stockDetails = await dbClient.sKU.findMany({
      where: {
        OR: data.map((item) => ({
          productId: item.productId,
          batchNumber: item.batchNumber,
        })),
      },
      select: {
        productId: true,
        batchNumber: true,
        quantity: true,
        salePrice: true,
        mrp: true,
        taxCode: true,
        id: true,
      },
    });

    return stockDetails;
  }

  async createCounterSale(data: CreateCounterSaleBilInput) {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;

    // Calculate the total paid amount
    const customerPaidAmount = data.cardAmount.reduce(
      (acc, { amount }) => acc + amount,
      data.cashAmount,
    );

    const sku = await this.getAvailabilityWithBatchNumber(data.items);

    const totalAmount = data.items.reduce((acc, item) => {
      const itemSku = sku.find((s) => s.productId === item.productId);
      return itemSku ? acc + item.saleQuantity * itemSku.salePrice : acc;
    }, 0);

    // Fetch tax codes
    const taxIds = [...new Set(sku.map((s) => s.taxCode.id))];
    const taxCodes = await taxCodeService.getTaxCodes(taxIds);

    // Prepare counter items
    const counterItems = data.items.map((item) => {
      const itemSku = sku.find((s) => s.productId === item.productId);
      if (!itemSku)
        throw new Error(`SKU not found for productId: ${item.productId}`);

      const taxRate = taxCodes[itemSku.taxCode.id]?.taxRate || 0;
      return {
        rate: itemSku.salePrice,
        discount: 0,
        tax: taxRate,
        skuId: itemSku.id,
        totalAmount: item.saleQuantity * itemSku.salePrice,
        quantity: item.saleQuantity,
        updatedBy: user.id,
      };
    });

    // Create the counter sale
    const counterSale = await dbClient.counterSale.create({
      data: {
        customerName: data.customerName,
        hospitalId,
        updatedBy: user.id,
        CounterSaleBill: totalAmount
          ? {
              create: {
                paid: customerPaidAmount,
                payments: {
                  cardAmount: data.cardAmount,
                  cashAmount: data.cashAmount,
                },
                totalAmount,
              },
            }
          : undefined,
        CounterItem: {
          createMany: { data: counterItems },
        },
      },
      include: {
        CounterItem: { include: { sku: true } },
        CounterSaleBill: true,
      },
    });

    return counterSale;
  }
}

export const pharmacyService = new PharmacyService();
