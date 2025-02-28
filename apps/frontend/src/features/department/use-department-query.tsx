import {
  CreateDepartmentInput,
  DepartmentResponse,
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
  options?: QueryOptions<PaginatedResponse<DepartmentResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<DepartmentResponse>>('/v1/department', {
        params: queryParams,
      }),
  });
};

export const useAllDepartmentQuery = (
  options?: QueryOptions<PaginatedResponse<DepartmentResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'all'],
    queryFn: () =>
      HttpService.get<PaginatedResponse<DepartmentResponse>>('/v1/departments'),
  });
};

export const useDepartmentByIdQuery = (
  id: string,
  options?: QueryOptions<DepartmentResponse>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () => HttpService.get<DepartmentResponse>(`/v1/department/${id}`),
  });
};

export const useCreateDepartmentMutation = (
  options?: UseMutationOptions<
    DepartmentResponse,
    unknown,
    CreateDepartmentInput
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreateDepartmentInput) =>
      HttpService.post<DepartmentResponse>('/v1/department', data),
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
  options?: UseMutationOptions<
    DepartmentResponse,
    unknown,
    UpdateDepartmentInput
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdateDepartmentInput) =>
      HttpService.put<DepartmentResponse>(`/v1/department/${data.id}`, data),
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
