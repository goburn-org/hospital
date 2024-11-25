import {
  PatientVisit,
  CreatePatientVisitRequest,
  PaginateParamsWithSort,
  PaginatedResponse,
  DetailedPatientVisit,
  Prisma,
  Maybe,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientVisitService {
  getLastVisit(patientId: string): Promise<PatientVisit | null> {
    const authUser = useAuthUser();
    return dbClient.patientVisit.findFirst({
      where: {
        uhid: patientId,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });
  }

  create(uhid: string, data: CreatePatientVisitRequest): Promise<PatientVisit> {
    const authUser = useAuthUser();
    return dbClient.patientVisit.create({
      data: {
        ...data,
        uhid,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
      },
    });
  }

  async getAll(
    uhid: string,
    params: PaginateParamsWithSort,
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
      include: {
        Assessment: true,
      },
    });
    if (!res) {
      return null;
    }
    return this.toDetailedPatientVisit(res);
  }

  toDetailedPatientVisit(
    data: Prisma.PatientVisitGetPayload<{
      include: {
        Assessment: true;
      };
    }>,
  ): DetailedPatientVisit {
    if (data.Assessment) {
      return {
        ...data,
        Assessment: {
          ...data.Assessment,
          diagnosis: data.Assessment?.diagnosis as any,
        },
      };
    }
    return {
      ...data,
      Assessment: null,
    };
  }
}

export const patientVisitService = new PatientVisitService();
