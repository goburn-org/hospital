import {
  CreatePatientInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
} from '@hospital/shared';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class PatientService {
  async create(data: CreatePatientInput): Promise<PatientResponse> {
    const authUser = useAuthUser();
    return dbClient.patient.create({
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : undefined,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
      },
    });
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
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.patient.count({
      where: {
        hospitalId: authUser.hospitalId,
        isDeleted: false,
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

  async getById(id: string): Promise<PatientResponse | null> {
    const authUser = useAuthUser();
    return dbClient.patient.findFirst({
      where: {
        uhid: id,
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
  }
}

export const patientService = new PatientService();
