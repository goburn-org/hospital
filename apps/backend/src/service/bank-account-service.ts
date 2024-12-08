import { BankAccountCreate, BankAccountResponse } from '@hospital/shared';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class BankAccountService {
  async getAll(): Promise<BankAccountResponse> {
    const user = useAuthUser();
    return dbClient.bankAccount.findMany({
      where: {
        hospitalId: user.hospitalId,
      },
    });
  }

  async create(data: BankAccountCreate): Promise<BankAccountResponse[number]> {
    const user = useAuthUser();
    return dbClient.bankAccount.create({
      data: {
        ...data,
        hospitalId: user.hospitalId,
        updatedBy: user.id,
      },
    });
  }

  async update(
    id: number,
    data: BankAccountCreate,
  ): Promise<BankAccountResponse[number]> {
    const user = useAuthUser();
    return dbClient.bankAccount.update({
      where: {
        id,
      },
      data: {
        ...data,
        hospitalId: user.hospitalId,
        updatedBy: user.id,
      },
    });
  }

  async updateActive(
    id: number,
    isActive: boolean,
  ): Promise<BankAccountResponse[number]> {
    const user = useAuthUser();
    return dbClient.bankAccount.update({
      where: {
        id,
      },
      data: {
        isActive,
        updatedBy: user.id,
      },
    });
  }
}

export const bankAccountService = new BankAccountService();
