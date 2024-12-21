import {
  CreatePatientVisitRequest,
  DetailedPatientVisit,
  DetailedPatientVisitGetPayload,
  PaginateParamsWithSort,
  PaginatedResponse,
  PatientVisit,
  PatientVisitResponse,
  Prisma,
  TokenResponse,
  getToday,
  getYesterday,
  patientVitalConverter,
  prescriptionDbConvertor,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientVisitService {
  async getLastVisit(patientId: string): Promise<PatientVisitResponse | null> {
    const authUser = useAuthUser();
    const r = await dbClient.patientVisit.findFirst({
      where: {
        uhid: patientId,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
      orderBy: {
        checkInTime: 'desc',
      },
      include: {
        PatientOrder: {
          select: {
            orderToDoctor: true,
            visitId: true,
          },
        },
      },
    });
    if (!r) {
      return null;
    }
    return {
      id: r.id,
      uhid: r.uhid,
      guardianName: r.guardianName,
      guardianMobile: r.guardianMobile,
      hospitalId: r.hospitalId,
      checkInTime: r.checkInTime,
      checkOutTime: r.checkOutTime,
      isDeleted: r.isDeleted,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      updatedBy: r.updatedBy,
      departmentId: r.departmentId,
      orderOpenedAt: r.orderOpenedAt,
      token: r.token,
      PatientOrder: r.PatientOrder
        ? {
            orderToDoctor: r.PatientOrder.orderToDoctor as Record<
              string,
              string
            >,
          }
        : null,
    };
  }

  checkout(visitId: string) {
    return dbClient.patientVisit.update({
      where: {
        id: visitId,
      },
      data: {
        checkOutTime: new Date(),
      },
    });
  }

  async create(
    uhid: string,
    data: Omit<CreatePatientVisitRequest, 'billing' | 'orders'>,
  ): Promise<PatientVisit> {
    const authUser = useAuthUser();
    const res = await dbClient.patientVisit.create({
      data: {
        ...data,
        uhid,
        checkInTime: new Date(),
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
      },
    });
    await dbClient.patient.update({
      where: {
        uhid,
      },
      data: {
        lastVisitAt: res.checkInTime,
      },
    });
    return res;
  }

  async getAll(
    uhid: string,
    params?: PaginateParamsWithSort,
  ): Promise<PaginatedResponse<PatientVisit>> {
    const authUser = useAuthUser();
    const { paginate, sort } = params || {};
    const dataPromise = dbClient.patientVisit.findMany({
      where: {
        uhid,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : {
            checkInTime: 'desc',
          },
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
      include: {
        PatientOrder: {
          select: {
            orderToDoctor: true,
          },
        },
      },
    });
    const totalPromise = dbClient.patientVisit.count({
      where: {
        uhid,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    const [data, total] = await Promise.all([dataPromise, totalPromise]);
    return {
      data,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async getById(id: string): Promise<DetailedPatientVisit | null> {
    const res = await dbClient.patientVisit.findUnique({
      where: {
        id,
      },
      ...DetailedPatientVisitGetPayload,
    });
    if (!res) {
      return null;
    }
    return this.toDetailedPatientVisit(res);
  }

  toDetailedPatientVisit(
    data: Prisma.PatientVisitGetPayload<typeof DetailedPatientVisitGetPayload>,
  ): DetailedPatientVisit {
    const result: DetailedPatientVisit = {
      ...data,
      Assessment: null,
      PatientOrder: data.PatientOrder
        ? ({
            ...data.PatientOrder,
            remark: data.PatientOrder?.remark as any,
            orderToDoctor: data.PatientOrder?.orderToDoctor as Record<
              string,
              string
            >,
            order: data.PatientOrder?.order.map((o) => ({
              ...o,
              remark: (data.PatientOrder?.remark as any)?.[o.id],
            })),
          } as any)
        : null,
      PatientPrescription: null,
      PatientVital: null,
    };
    if (data.PatientVital) {
      result['PatientVital'] = patientVitalConverter.from(data.PatientVital);
    }
    if (data.Assessment) {
      result['Assessment'] = {
        ...data.Assessment,
        diagnosis: data.Assessment?.diagnosis as any,
      };
    }
    if (data.PatientPrescription) {
      result['PatientPrescription'] = prescriptionDbConvertor.from(
        data.PatientPrescription.list,
      ) as any;
    }
    return result;
  }

  async getToken(doctorId: string): Promise<TokenResponse> {
    const yesterday = getYesterday();
    const today = getToday();
    const yourTokenPromise = dbClient.patientVisit.count({
      where: {
        PatientOrder: {
          doctorIds: {
            has: doctorId,
          },
        },
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });
    const tokensCompletedPromise = dbClient.patientVisit.count({
      where: {
        PatientOrder: {
          doctorIds: {
            has: doctorId,
          },
        },
        orderOpenedAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });
    const [yourToken, tokensCompleted] = await Promise.all([
      yourTokenPromise,
      tokensCompletedPromise,
    ]);
    return {
      yourToken: yourToken + 1,
      tokensCompleted: tokensCompleted,
    };
  }

  async open(visitId: string): Promise<PatientVisit> {
    const res = await dbClient.patientVisit.update({
      where: {
        id: visitId,
      },
      data: {
        orderOpenedAt: new Date(),
      },
    });
    return res;
  }
}

export const patientVisitService = new PatientVisitService();
