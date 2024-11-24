import { Prisma } from '@prisma/client';
import { dbClient } from '../prisma';

class HospitalService {
  create(data: Prisma.HospitalCreateInput) {
    return dbClient.hospital.create({
      data,
    });
  }
}

export const hospitalService = new HospitalService();
