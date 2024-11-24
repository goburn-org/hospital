import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../../utils/http';
import { HOSPITAL_ID } from '../../env';
import { Hospital } from '@prisma/client';

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
