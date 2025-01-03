import { UOMType } from '@hospital/shared';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['uom'];

export const useUomQuery = (options?: QueryOptions<UOMType[]>) => {
  return useQuery({
    ...(options || {}),
    queryKey: queryKey,
    queryFn: () => HttpService.get<UOMType[]>('/v1/util/uom'),
  });
};
