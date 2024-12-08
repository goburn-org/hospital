import {
  AllPatientVisitBillingResponse,
  AvailableOrder,
  CreatePatientBillingRequest,
  HttpError,
  OpBillingReportQuery,
  OpBillingReportResponse,
  PaginatedResponse,
  PaginateParamsWithSort,
  VisitBill,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';
import { taxCodeService } from '../tax-code-service';

class PatientBillingService {
  async upsert(visitId: string, data: CreatePatientBillingRequest) {
    const user = useAuthUser();
    return dbClient.visitBilling.upsert({
      where: {
        visitId,
      },
      create: {
        visitId,
        hospitalId: user.hospitalId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }

  async getBillingAndReceipt(visitIds: string[]) {
    const billingPromise = dbClient.bill.findMany({
      where: {
        visitId: {
          in: visitIds.map((v) => v),
        },
      },
    });
    const receiptPromise = dbClient.receipt.findMany({
      where: {
        visitId: {
          in: visitIds.map((v) => v),
        },
      },
    });
    const [billing, receipt] = await Promise.all([
      billingPromise,
      receiptPromise,
    ]);
    const byVisit = visitIds.map((v) => ({
      visitId: v,
      billing: billing
        .filter((b) => b.visitId === v)
        .map((b) => ({
          billId: b.visitId,
          total: b.totalAmount,
        })),
      receipt: receipt
        .filter((r) => r.visitId === v)
        .map((r) => ({
          receiptId: r.id,
          billId: r.billId,
          paid: r.paid,
          reason: r.reason,
          mode: r.paymentMode,
        })),
    }));
    return byVisit;
  }

  async getByPatientId(
    patientId: string,
  ): Promise<VisitBillingAggregationByPatientId[]> {
    const visits = await dbClient.patientVisit.findMany({
      where: {
        uhid: patientId,
      },
    });

    return this.getBillingAndReceipt(visits.map((v) => v.id));
  }

  async getAllInLast24Hrs(
    param: PaginateParamsWithSort & {
      query?: {
        orderIds: string[];
      };
    },
  ): Promise<PaginatedResponse<AllPatientVisitBillingResponse>> {
    const last24Hours = new Date();
    const { paginate, sort, query } = param || {};
    const authUser = useAuthUser();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const visits = await dbClient.patientVisit.findMany({
      where: {
        checkInTime: {
          gte: last24Hours,
        },
        hospitalId: authUser.hospitalId,
        isDeleted: false,
        ...(query?.orderIds?.length
          ? {
              PatientOrder: {
                OR: query.orderIds.map((o) => ({
                  order: {
                    some: {
                      id: o,
                    },
                  },
                })),
              },
            }
          : {}),
      },
      orderBy: sort?.field
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate?.limit,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
      include: {
        Patient: true,
      },
    });
    const total = await dbClient.patientVisit.count({
      where: {
        checkInTime: {
          gte: last24Hours,
        },
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    const byVisit = await this.getBillingAndReceipt(visits.map((v) => v.id));
    return {
      data: visits.map((v) => ({
        patient: {
          city: v.Patient.city,
          lastVisit: v.checkInTime,
          mobile: v.Patient.mobile,
          name: v.Patient.name,
          uhid: v.Patient.uhid,
        },
        lastVisit: {
          visitId: v.id,
          billing: byVisit.find((b) => b.visitId === v.id)?.billing ?? [],
          receipt: byVisit.find((b) => b.visitId === v.id)?.receipt ?? [],
        },
      })),
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async getAll(
    param: PaginateParamsWithSort & OpBillingReportQuery,
  ): Promise<OpBillingReportResponse> {
    const { paginate, sort, query } = param || {};
    console.log({ query }, 'test');
    const authUser = useAuthUser();
    const visits = await dbClient.patientVisit.findMany({
      where: {
        checkInTime:
          query?.visitDate?.from && query?.visitDate?.to
            ? {
                gte: new Date(query.visitDate.from),
                lte: new Date(query.visitDate.to),
              }
            : undefined,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
        ...(query?.orderIds?.length
          ? {
              PatientOrder: {
                OR: query.orderIds.map((o) => ({
                  order: {
                    some: {
                      id: o,
                    },
                  },
                })),
              },
            }
          : {}),
      },
      orderBy: sort?.field
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate?.limit,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
      include: {
        Patient: true,
        BillingPatientOrderLineItem: {
          include: {
            order: true,
          },
        },
        BillingConsultationOrderLineItem: {
          include: {
            order: true,
          },
        },
        PatientOrder: {
          include: {
            order: true,
          },
        },
      },
    });
    const total = await dbClient.patientVisit.count({
      where: {
        checkInTime:
          query?.visitDate?.from && query?.visitDate?.to
            ? {
                gte: new Date(query.visitDate.from),
                lte: new Date(query.visitDate.to),
              }
            : undefined,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
        ...(query?.orderIds?.length
          ? {
              PatientOrder: {
                OR: query.orderIds.map((o) => ({
                  order: {
                    some: {
                      id: o,
                    },
                  },
                })),
              },
            }
          : {}),
      },
    });
    const byVisit = await this.getBillingAndReceipt(visits.map((v) => v.id));
    const totalBilling = await dbClient.bill.aggregate({
      where: {
        Visit: {
          checkInTime:
            query?.visitDate?.from && query?.visitDate?.to
              ? {
                  gte: new Date(query.visitDate.from),
                  lte: new Date(query.visitDate.to),
                }
              : undefined,
          ...(query?.orderIds?.length
            ? {
                PatientOrder: {
                  OR: query.orderIds.map((o) => ({
                    order: {
                      some: {
                        id: o,
                      },
                    },
                  })),
                },
              }
            : {}),
        },
        hospitalId: authUser.hospitalId,
      },
      _sum: {
        totalAmount: true,
      },
    });
    return {
      data: visits.map((v) => ({
        patient: {
          city: v.Patient.city,
          lastVisit: v.checkInTime,
          mobile: v.Patient.mobile,
          name: v.Patient.name,
          uhid: v.Patient.uhid,
        },
        BillingConsultationOrderLineItem: v.BillingConsultationOrderLineItem,
        BillingPatientOrderLineItem: v.BillingPatientOrderLineItem,
        PatientOrder: v.PatientOrder,
        lastVisit: {
          visitId: v.id,
          billing: byVisit.find((b) => b.visitId === v.id)?.billing ?? [],
          receipt: byVisit.find((b) => b.visitId === v.id)?.receipt ?? [],
        },
      })),
      totalBilling: totalBilling._sum.totalAmount ?? 0,
      totalVisit: total,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async getBill(visitId: string): Promise<VisitBill | null> {
    const bill = await dbClient.bill.findMany({
      where: {
        visitId,
      },
      include: {
        BillingConsultationOrderLineItem: {
          include: {
            order: true,
          },
        },
        BillingPatientOrderLineItem: {
          include: {
            order: true,
          },
        },
        Visit: true,
      },
    });
    if (!bill) {
      return null;
    }
    const receipt = await dbClient.receipt.findMany({
      where: {
        visitId,
      },
    });
    return {
      bill,
      Receipt: receipt,
    };
  }

  async createOutpatientBilling(
    visitId: string,
    isConsultation: boolean,
    order: AvailableOrder[],
  ) {
    const authUser = useAuthUser();
    const taxCodes = await taxCodeService.getTaxCodes([
      ...new Set(order.map((o) => o.taxCodeId)),
    ]);
    if (isConsultation) {
      const consultations =
        await dbClient.billingConsultationOrderLineItem.createManyAndReturn({
          data: order.map((o) => ({
            discount: 0,
            quantity: 1,
            orderId: o.id,
            isRemoved: false,
            rate: o.baseAmount,
            tax: taxCodes[o.taxCodeId].taxRate ?? 0,
            visitId,
            hospitalId: authUser.hospitalId,
            updatedBy: authUser.id,
            totalAmount:
              o.baseAmount * taxCodes[o.taxCodeId].taxRate + o.baseAmount,
          })),
        });
      const totalAmount = consultations.reduce(
        (acc, c) => acc + c.totalAmount,
        0,
      );
      await dbClient.bill.create({
        data: {
          hospitalId: authUser.hospitalId,
          updatedBy: authUser.id,
          BillingConsultationOrderLineItem: {
            connect: consultations.map((c) => ({
              id: c.id,
            })),
          },
          totalAmount,
          visitId: visitId,
          items: {},
        },
      });
    } else {
      const totalAmount = order.reduce(
        (acc, c) =>
          acc + (c.baseAmount * taxCodes[c.taxCodeId].taxRate + c.baseAmount),
        0,
      );
      await dbClient.bill.create({
        data: {
          hospitalId: authUser.hospitalId,
          updatedBy: authUser.id,
          totalAmount,
          visitId: visitId,
          BillingPatientOrderLineItem: {
            createMany: {
              data: order.map((o) => ({
                discount: 0,
                quantity: 1,
                orderId: o.id,
                rate: o.baseAmount,
                isRemoved: false,
                tax: taxCodes[o.taxCodeId].taxRate ?? 0,
                visitId,
                hospitalId: authUser.hospitalId,
                updatedBy: authUser.id,
                totalAmount:
                  o.baseAmount * taxCodes[o.taxCodeId].taxRate + o.baseAmount,
              })),
            },
          },
          items: {},
        },
      });
    }
  }

  async toggleLineItem(
    visitId: string,
    lineItemId: number,
    isRemoved: boolean,
  ) {
    const authUser = useAuthUser();
    let amount = 0;
    const bill = await dbClient.bill.findFirst({
      where: {
        visitId,
        OR: [
          {
            BillingConsultationOrderLineItem: {
              some: {
                id: lineItemId,
              },
            },
          },
          {
            BillingPatientOrderLineItem: {
              some: {
                id: lineItemId,
              },
            },
          },
        ],
      },
      include: {
        BillingConsultationOrderLineItem: true,
        BillingPatientOrderLineItem: true,
      },
    });
    if (!bill) {
      throw new HttpError('Bill not found', 404);
    }
    try {
      const consultationOrder =
        await dbClient.billingConsultationOrderLineItem.update({
          where: {
            id: lineItemId,
          },
          data: {
            isRemoved,
            updatedBy: authUser.id,
          },
        });
      amount = consultationOrder.totalAmount;
    } catch (e) {
      console.log(e);
    }
    try {
      if (!amount) {
        const billingOrder = await dbClient.billingPatientOrderLineItem.update({
          where: {
            id: lineItemId,
          },
          data: {
            isRemoved,
            updatedBy: authUser.id,
          },
        });
        amount = billingOrder.totalAmount;
      }
    } catch (e) {
      console.log(e);
    }

    if (!bill) {
      return;
    }
    await dbClient.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        totalAmount: isRemoved
          ? {
              decrement: amount,
            }
          : {
              increment: amount,
            },
      },
    });
  }
}

export const patientBillingService = new PatientBillingService();
