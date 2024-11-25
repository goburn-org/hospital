import { Prisma } from '@hospital/shared';
import { dbClient } from '../prisma';

class HospitalService {
  create(data: Prisma.HospitalUncheckedCreateInput) {
    return dbClient.hospital.create({
      data,
    });
  }
  getById(id: number) {
    return dbClient.hospital.findUnique({
      where: {
        id,
      },
    });
  }
}

export const hospitalService = new HospitalService();
