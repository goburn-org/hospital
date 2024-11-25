import { Hospital } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { HOSPITAL_ID } from '../../env';
import { HttpService } from '../../utils/http';

export const useAccountConfig = () => {
  return useQuery({
    queryKey: ['account-config'],
    queryFn: async () => {
      const response = await HttpService.get<Hospital>(
        `/v1/account-config/${HOSPITAL_ID}`,
      );
      return response;
    },
  });
};
