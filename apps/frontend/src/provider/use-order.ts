import { AvailableOrder } from '@hospital/shared';
import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../utils/http';

export const useOrderQuery = () => {
  return useQuery({
    queryKey: ['order'],
    queryFn: () => HttpService.get<AvailableOrder[]>('/v1/util/orders'),
    refetchOnMount: false,
    staleTime: Infinity,
  });
};
