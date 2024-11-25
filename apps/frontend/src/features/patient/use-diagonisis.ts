import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../../utils/http';
import { Diagnosis, PaginatedResponse, PaginateParams } from '@hospital/shared';

export const useDiagnosisQuery = (search: string, param: PaginateParams) => {
  return useQuery({
    queryKey: ['diagnosis', search, param],
    queryFn: async () => {
      return await HttpService.get<PaginatedResponse<Diagnosis>>(
        '/v1/diagnosis',
        {
          params: {
            search,
            ...param,
          },
        },
      );
    },
  });
};
