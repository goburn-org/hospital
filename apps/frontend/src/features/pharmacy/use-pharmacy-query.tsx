import {
  CounterSaleResponse,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
} from '@hospital/shared';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

export const usePatientPrescriptionQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<PatientResponse>>,
) => {
  return useQuery({
    queryKey: ['pharmacy', queryParams],
    queryFn: () => {
      return HttpService.get<PaginatedResponse<CounterSaleResponse>>(
        '/v1/pharmacy',
        {
          params: queryParams,
        },
      );
    },
  });
};
