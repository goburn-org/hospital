import {
  CreatePatientInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
} from '@hospital/shared';
import { useAuthUser } from '../../provider/async-context';
import { dbClient } from '../../prisma';
import { patientVisitService } from './patient-visit-service';

class PatientService {
  async create(data: CreatePatientInput): Promise<PatientResponse> {
    const authUser = useAuthUser();
    const response = await dbClient.patient.create({
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : undefined,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
      },
    });
    return {
      ...response,
      lastVisit: null,
    };
  }

  async getAll(
    params: PaginateParamsWithSort,
  ): Promise<PaginatedResponse<PatientResponse>> {
    const authUser = useAuthUser();
    const { paginate, sort } = params || {};
    const data = await dbClient.patient.findMany({
      where: {
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
        PatientVisit: {
          where: {
            isDeleted: false,
          },
          orderBy: {
            checkInTime: 'desc',
          },
          take: 1,
        },
      },
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.patient.count({
      where: {
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    const result: PatientResponse[] = [];
    for (const d of data) {
      const { PatientVisit, ...rest } = d;
      result.push({
        ...rest,
        lastVisit: d.PatientVisit[0] ?? null,
      });
    }
    return {
      data: result,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async getById(id: string): Promise<PatientResponse | null> {
    const authUser = useAuthUser();
    const patient = await dbClient.patient.findFirst({
      where: {
        uhid: id,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    if (!patient) {
      return null;
    }
    const lastVisit = await patientVisitService.getLastVisit(id);
    return {
      ...patient,
      lastVisit,
    };
  }
}

export const patientService = new PatientService();
