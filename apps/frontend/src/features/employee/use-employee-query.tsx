import {
  CreateEmployeeInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  UpdateEmployeeInput,
  User,
  UserWithRolesAndDepartment,
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
  options?: QueryOptions<PaginatedResponse<UserWithRolesAndDepartment>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams, options],
    queryFn: () =>
      HttpService.get<PaginatedResponse<UserWithRolesAndDepartment>>(
        '/v1/employee',
        {
          params: queryParams,
        },
      ),
  });
};

export const useDoctorQuery = (options?: QueryOptions<User[]>) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'doctor'],
    queryFn: () => HttpService.get<User[]>('/v1/employee/doctor'),
  });
};

export const fetchDoctorName = async (doctorId: string[]) => {
  const res = await HttpService.get<User[]>('/v1/employee', {
    params: {
      empIds: doctorId,
    },
  });
  return res.reduce(
    (acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const useEmployeeByIdQuery = (
  id: string,
  options?: QueryOptions<UserWithRolesAndDepartment>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () =>
      HttpService.get<UserWithRolesAndDepartment>(`/v1/employee/${id}`),
  });
};

export const useCreateEmployeeMutation = (
  options?: UseMutationOptions<
    UserWithRolesAndDepartment,
    unknown,
    CreateEmployeeInput
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreateEmployeeInput) =>
      HttpService.post<UserWithRolesAndDepartment>('/v1/employee', data),
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
  options?: UseMutationOptions<
    UserWithRolesAndDepartment,
    unknown,
    UpdateEmployeeInput
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdateEmployeeInput) =>
      HttpService.put<UserWithRolesAndDepartment>(
        `/v1/employee/${data.id}`,
        data,
      ),
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
