import {
  AllPatientVisitBillingResponse,
  CreatePatientBillingRequest,
  CreatePatientInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  PatientResponse,
  UpdatePatientInput,
  VisitBill,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';
import { VisitIdPatientId } from './use-patient-visit';

const queryKey = ['patient'];

export const usePatientQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<PatientResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams, options],
    queryFn: () =>
      HttpService.get<PaginatedResponse<PatientResponse>>('/v1/patient', {
        params: queryParams,
      }),
  });
};

export const usePatientBillingQueryById = (
  patientId: string,
  options?: QueryOptions<VisitBillingAggregationByPatientId[]>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'billing', patientId, options],
    queryFn: () =>
      HttpService.get<VisitBillingAggregationByPatientId[]>(
        `/v1/billing/${patientId}`,
      ),
  });
};

export const useAllPatientBillingQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<AllPatientVisitBillingResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'billing', 'all', options],
    queryFn: () =>
      HttpService.get<PaginatedResponse<AllPatientVisitBillingResponse>>(
        `/v1/billing`,
        {
          params: queryParams,
        },
      ),
  });
};

export const usePatientBillingAutoGenerateQuery = (param: VisitIdPatientId) => {
  return useQuery({
    queryKey: [...queryKey, 'billing', param.patientId, param.visitId],
    queryFn: () =>
      HttpService.get<VisitBill>(
        `/v1/billing/${param.patientId}/${param.visitId}`,
      ),
  });
};

export const usePatientBillingAutoGenerateMutation = (
  param: VisitIdPatientId,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      HttpService.post<VisitBill>(
        `/v1/billing/${param.patientId}/${param.visitId}`,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey.includes('billing');
        },
      });
    },
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
    enabled: !!id,
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

export const usePatientVisitCheckoutMutation = (
  options: UseMutationOptions<
    VisitBillingAggregationByPatientId,
    unknown,
    CreatePatientBillingRequest & VisitIdPatientId
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (param) =>
      HttpService.post<VisitBillingAggregationByPatientId>(
        `/v1/receipt/${param.patientId}/${param.visitId}`,
        param,
      ),
    onSuccess: (res, req, ctx) => {
      options.onSuccess?.(res, req, ctx);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('billing'),
      });
      queryClient.invalidateQueries({
        queryKey: ['patient-visit', req.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ['patient', req.patientId],
      });
    },
  });
};
