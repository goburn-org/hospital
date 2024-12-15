import { AllTokensResponse } from '@hospital/shared';
import { useAuthUser } from '../provider/async-context';
import { employeeService } from './employee-service';
import { patientVisitService } from './patient/patient-visit-service';

class TokenService {
  async getAll(): Promise<AllTokensResponse> {
    const user = useAuthUser();
    const isAdmin = user.Department.Role?.isSuperAdmin;
    const doctors = isAdmin
      ? await employeeService.getAllDoctor({
          hospitalId: user.hospitalId,
        })
      : [user];
    const tokens = await Promise.all(
      doctors.map((d) => patientVisitService.getToken(d.id)),
    );
    const tokenMap = tokens.reduce(
      (acc, t, idx) => ({
        ...acc,
        [doctors[idx].id]: {
          ...t,
          consultantName: doctors[idx].name,
        },
      }),
      {} as AllTokensResponse,
    );
    return tokenMap;
  }
}

export const tokenService = new TokenService();
