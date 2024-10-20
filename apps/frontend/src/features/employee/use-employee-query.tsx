import {
  CreateEmployeeInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateEmployeeInput,
  User,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['employee'];

export const useEmployeeQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<User>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<User>>('/v1/employee', {
        params: queryParams,
      }),
  });
};

export const useEmployeeByIdQuery = (
  id: string,
  options?: QueryOptions<User>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () => HttpService.get<User>(`/v1/employee/${id}`),
  });
};

export const useCreateEmployeeMutation = (
  options?: UseMutationOptions<User, unknown, CreateEmployeeInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreateEmployeeInput) =>
      HttpService.post<User>('/v1/employee', data),
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

export const useUpdateEmployeeMutation = (
  options?: UseMutationOptions<User, unknown, UpdateEmployeeInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdateEmployeeInput) =>
      HttpService.put<User>(`/v1/employee/${data.id}`, data),
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
