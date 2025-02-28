import {
  CreatePatientInput,
  ensure,
  getToday,
  getYesterday,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
  Prisma,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';
import { hospitalService } from '../hospital-service';
import { patientVisitService } from './patient-visit-service';

class PatientService {
  async create(data: CreatePatientInput): Promise<PatientResponse> {
    const { age, ...rest } = data;
    const authUser = useAuthUser();
    const hospital = await hospitalService.getById(authUser.hospitalId);
    ensure(hospital, 'Hospital not found');
    const date = Date.now();
    const randomDigit = Math.floor(Math.random() * 100);
    const bornYear = data.dob
      ? new Date(data.dob).getFullYear()
      : data.age
        ? new Date().getFullYear() - data.age
        : undefined;
    const response = await dbClient.patient.create({
      data: {
        ...rest,
        dob: data.dob ? new Date(data.dob) : undefined,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
        bornYear: bornYear,
        uhid: `${hospital.hospitalCode}-${date}${randomDigit}`,
      },
    });
    return {
      ...response,
      lastVisit: null,
      age: response.bornYear
        ? new Date().getFullYear() - response.bornYear
        : undefined,
    };
  }

  async update(
    uhid: string,
    data: CreatePatientInput,
  ): Promise<PatientResponse> {
    const { age, ...rest } = data;
    const authUser = useAuthUser();
    const hospital = await hospitalService.getById(authUser.hospitalId);
    ensure(hospital, 'Hospital not found');
    const date = Date.now();
    const randomDigit = Math.floor(Math.random() * 100);
    const bornYear = data.dob
      ? new Date(data.dob).getFullYear()
      : data.age
        ? new Date().getFullYear() - data.age
        : undefined;
    const response = await dbClient.patient.update({
      where: {
        uhid,
      },
      data: {
        ...rest,
        dob: data.dob ? new Date(data.dob) : undefined,
        hospitalId: authUser.hospitalId,
        updatedBy: authUser.id,
        bornYear: bornYear,
        uhid: `${hospital.hospitalCode}-${date}${randomDigit}`,
      },
    });
    return {
      ...response,
      lastVisit: null,
      age: response.bornYear
        ? new Date().getFullYear() - response.bornYear
        : undefined,
    };
  }

  async getAll(
    params: PaginateParamsWithSort,
  ): Promise<PaginatedResponse<PatientResponse>> {
    const authUser = useAuthUser();
    const isAdmin = authUser.Department.Role?.isSuperAdmin;
    const { paginate, sort } = params || {};
    const yesterday = getYesterday();
    const today = getToday();
    const query: Prisma.PatientFindManyArgs['where'] = isAdmin
      ? {
          hospitalId: authUser.hospitalId,
          isDeleted: false,
        }
      : {
          hospitalId: authUser.hospitalId,
          isDeleted: false,
          PatientVisit: {
            some: {
              PatientOrder: {
                doctorIds: {
                  has: authUser.id,
                },
              },
              checkInTime: {
                gte: yesterday,
                lt: today,
              },
            },
          },
        };
    const data = await dbClient.patient.findMany({
      where: query,
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : {
            lastVisitAt: {
              sort: 'desc',
              nulls: 'last',
            },
          },
      take: paginate ? paginate.limit : undefined,
      include: {
        PatientVisit: {
          where: {
            isDeleted: false,
          },
          include: {
            PatientOrder: {
              select: {
                orderToDoctor: true,
              },
            },
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
      where: query,
    });
    const result: PatientResponse[] = [];
    for (const d of data) {
      const { PatientVisit, ...rest } = d;
      result.push({
        ...rest,
        lastVisit:
          PatientVisit.length > 0
            ? {
                ...PatientVisit?.[0],
                PatientOrder: {
                  orderToDoctor: PatientVisit?.[0]?.PatientOrder
                    ?.orderToDoctor as Record<string, string>,
                },
              }
            : undefined,
        age: d.bornYear ? new Date().getFullYear() - d.bornYear : undefined,
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
      age: patient.bornYear
        ? new Date().getFullYear() - patient.bornYear
        : undefined,
    };
  }

  async getArea(search: string): Promise<string[]> {
    const authUser = useAuthUser();
    const data = await dbClient.patient.findMany({
      where: {
        hospitalId: authUser.hospitalId,
        isDeleted: false,
        area: {
          contains: search,
          mode: 'insensitive',
        },
      },
      distinct: ['area'],
    });
    return data.map((d) => d.area).filter(Boolean) as string[];
  }
}

export const patientService = new PatientService();
