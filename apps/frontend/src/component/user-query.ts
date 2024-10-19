import { User } from '@prisma/client';

import { apiTokenStorage } from '../provider/auth/auth-util';
import { HttpService } from '../utils/http';
import { useQuery } from '@tanstack/react-query';

const userQueryKey = ['user'];

export const useUserQuery = () => {
  const hasToken = apiTokenStorage.getToken() != null;
  return useQuery({
    queryKey: userQueryKey,
    queryFn: async () => {
      try {
        const token = apiTokenStorage.getToken();
        if (token == null) {
          return null;
        }
        HttpService.updateToken(token!);
        apiTokenStorage.setToken(token!);
        const user = await HttpService.get<User>('v1/user');
        return user;
      } catch (e) {
        HttpService.updateToken('');
        apiTokenStorage.setToken('');
        console.log(e);
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    enabled: hasToken,
  });
};
