import {
  CreatePatientInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
  UpdatePatientInput,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['patient'];

export const usePatientQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<PatientResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<PatientResponse>>('/v1/patient', {
        params: queryParams,
      }),
  });
};

export const useAllPatientQuery = (
  options?: QueryOptions<PaginatedResponse<PatientResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'all'],
    queryFn: () =>
      HttpService.get<PaginatedResponse<PatientResponse>>('/v1/patient'),
  });
};

export const usePatientByIdQuery = (
  id: string,
  options?: QueryOptions<PatientResponse>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () => HttpService.get<PatientResponse>(`/v1/patient/${id}`),
  });
};

export const useCreatePatientMutation = (
  options?: UseMutationOptions<PatientResponse, unknown, CreatePatientInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreatePatientInput) =>
      HttpService.post<PatientResponse>('/v1/patient', data),
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

export const useUpdatePatientMutation = (
  options?: UseMutationOptions<PatientResponse, unknown, UpdatePatientInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdatePatientInput) =>
      HttpService.put<PatientResponse>(`/v1/patient/${data.uhid}`, data),
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
