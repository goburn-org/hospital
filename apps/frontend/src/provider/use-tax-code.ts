import { TaxCodeResponse } from '@hospital/shared';
import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../utils/http';

const QUERY_KEY = ['tax-code'];
export const useTaxCode = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await HttpService.get<TaxCodeResponse[]>('/v1/util/tax');
    },
  });
};
