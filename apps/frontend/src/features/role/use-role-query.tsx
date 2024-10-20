import {
  CreateRoleInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  Role,
  UpdateRoleInput,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['roles'];

export const useRoleQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<Role>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<Role>>('/v1/role', {
        params: queryParams,
      }),
  });
};

export const useCreateRoleMutation = (
  options?: UseMutationOptions<Role, unknown, CreateRoleInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (role: CreateRoleInput) =>
      HttpService.post<Role>('/v1/role', role),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey.includes(queryKey[0]);
        },
      });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateRoleMutation = (
  options?: UseMutationOptions<Role, unknown, UpdateRoleInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (role: UpdateRoleInput) =>
      HttpService.post<Role>('/v1/role', role),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey.includes(queryKey[0]);
        },
      });
      options?.onSuccess?.(...args);
    },
  });
};
