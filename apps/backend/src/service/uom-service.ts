import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class UOMService {
  async getAll() {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    return dbClient.uOM.findMany({
      where: {
        hospitalId,
      },
    });
  }
}

export const uomService = new UOMService();
