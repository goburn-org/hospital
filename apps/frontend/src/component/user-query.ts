import { User } from '@prisma/client';

import { apiTokenStorage } from '../provider/auth/auth-util';
import { HttpService } from '../utils/http';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  LoginResponse,
  UserLoginInput,
  UserWithRolesAndDepartment,
} from '@hospital/shared';
import { useEffect } from 'react';

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
        HttpService.updateToken(token);
        apiTokenStorage.setToken(token);
        const user =
          await HttpService.get<UserWithRolesAndDepartment>('v1/auth');
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

export const useRedirectIfNotAuthenticated = () => {
  const { data, isLoading } = useUserQuery();
  useEffect(() => {
    if (!isLoading && !data) {
      window.location.href = '/login';
    }
  }, [data, isLoading]);
};

export const useLoginMutation = (
  options?: UseMutationOptions<LoginResponse, unknown, UserLoginInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data: UserLoginInput) => {
      const response = await HttpService.post<LoginResponse>(
        'v1/auth/login',
        data,
      );
      apiTokenStorage.setToken(response.token);
      return response;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: userQueryKey,
      });
      options?.onSuccess?.(...args);
    },
  });
};
