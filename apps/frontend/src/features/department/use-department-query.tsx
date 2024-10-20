import {
  CreateDepartmentInput,
  Department,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateDepartmentInput,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['department'];

export const useDepartmentQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<Department>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<Department>>('/v1/department', {
        params: queryParams,
      }),
  });
};

export const useDepartmentByIdQuery = (
  id: string,
  options?: QueryOptions<Department>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () => HttpService.get<Department>(`/v1/department/${id}`),
  });
};

export const useCreateDepartmentMutation = (
  options?: UseMutationOptions<Department, unknown, CreateDepartmentInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreateDepartmentInput) =>
      HttpService.post<Department>('/v1/department', data),
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

export const useUpdateDepartmentMutation = (
  options?: UseMutationOptions<Department, unknown, UpdateDepartmentInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdateDepartmentInput) =>
      HttpService.put<Department>(`/v1/department/${data.id}`, data),
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
