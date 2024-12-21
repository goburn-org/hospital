import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../utils/http';

export const useAreaQuery = (search: string) => {
  return useQuery({
    queryKey: ['area', search],
    queryFn: async () => {
      return await HttpService.get<string[]>(`/v1/util/area?q=${search}`);
    },
  });
};
