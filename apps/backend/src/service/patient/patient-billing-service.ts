import {
  AllPatientVisitBillingResponse,
  CreatePatientBillingRequest,
  PaginatedResponse,
  PaginateParamsWithSort,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientBillingService {
  async upsert(visitId: string, data: CreatePatientBillingRequest) {
    return dbClient.visitBilling.upsert({
      where: {
        visitId,
      },
      create: {
        visitId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }

  async getByPatientId(
    patientId: string,
  ): Promise<VisitBillingAggregationByPatientId[]> {
    const visits = await dbClient.patientVisit.findMany({
      where: {
        uhid: patientId,
      },
    });
    const billing = await dbClient.visitBilling.findMany({
      where: {
        visitId: {
          in: visits.map((v) => v.id),
        },
      },
    });
    const receipt = await dbClient.receipt.findMany({
      where: {
        visitId: {
          in: visits.map((v) => v.id),
        },
      },
    });
    const byVisit = visits.map((v) => ({
      visitId: v.id,
      billing: billing
        .filter((b) => b.visitId === v.id)
        .map((b) => ({
          billId: b.visitId,
          total: b.totalAmount,
          cardAmount: b.cardAmount,
          cashAmount: b.cashAmount,
        })),
      receipt: receipt
        .filter((r) => r.visitId === v.id)
        .map((r) => ({
          receiptId: r.id,
          billId: r.billId,
          paid: r.paid,
          reason: r.reason,
        })),
    }));
    return byVisit;
  }

  async getAll(
    param: PaginateParamsWithSort,
  ): Promise<PaginatedResponse<AllPatientVisitBillingResponse>> {
    const last24Hours = new Date();
    const { paginate, sort } = param || {};
    const authUser = useAuthUser();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const visits = await dbClient.patientVisit.findMany({
      where: {
        checkInTime: {
          gte: last24Hours,
        },
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate ? paginate.limit : undefined,
      include: {
        Patient: true,
      },
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.patient.count({
      where: {
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    const billingPromise = dbClient.visitBilling.findMany({
      where: {
        visitId: {
          in: visits.map((v) => v.id),
        },
      },
    });
    const receiptPromise = dbClient.receipt.findMany({
      where: {
        visitId: {
          in: visits.map((v) => v.id),
        },
      },
    });
    const [billing, receipt] = await Promise.all([
      billingPromise,
      receiptPromise,
    ]);
    const byVisit = visits.map((v) => ({
      visitId: v.id,
      billing: billing
        .filter((b) => b.visitId === v.id)
        .map((b) => ({
          billId: b.visitId,
          total: b.totalAmount,
          cardAmount: b.cardAmount,
          cashAmount: b.cashAmount,
        })),
      receipt: receipt
        .filter((r) => r.visitId === v.id)
        .map((r) => ({
          receiptId: r.id,
          billId: r.billId,
          paid: r.paid,
          reason: r.reason,
        })),
    }));
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
}

export const patientBillingService = new PatientBillingService();
