import {
  PatientVisit,
  CreatePatientVisitRequest,
  PaginateParamsWithSort,
  PaginatedResponse,
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
}

export const patientVisitService = new PatientVisitService();
