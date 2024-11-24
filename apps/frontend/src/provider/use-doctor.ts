import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../utils/http';
import { User } from '@prisma/client';
import { PaginatedResponse } from '@hospital/shared';

export const useDoctor = (search: string) => {
  return useQuery({
    queryKey: ['doctor', search],
    queryFn: async () =>
      HttpService.get<PaginatedResponse<User>>('/v1/doctor', {
        params: {
          search,
        },
      }),
  });
};
