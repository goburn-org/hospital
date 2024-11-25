import {
  AssessmentResponse,
  CreateAssessmentRequest,
  CreatePatientOrderRequest,
  CreatePatientPrescriptionRequest,
  CreatePatientVisitRequest,
  CreatePatientVitalRequest,
  DetailedPatientVisit,
  PatientOrderResponse,
  PatientVisit,
} from '@hospital/shared';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

export type VisitIdPatientId = {
  visitId: string;
  patientId: string;
};

const VisitQueryKey = (param: VisitIdPatientId) => ['patient-visit', param];

export const usePatientAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) =>
      HttpService.post<AssessmentResponse>(
        `/v1/visit/assessment/${data.patientId}/${data.visitId}`,
        data,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: VisitQueryKey({
          visitId: data.visitId,
          patientId: data.patientId,
        }),
      });
    },
  });
};

export const usePatientOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientOrderRequest) =>
      HttpService.post<PatientOrderResponse>(
        `v1/visit/order/${data.patientId}/${data.visitId}`,
        data,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: VisitQueryKey({
          visitId: data.visitId,
          patientId: data.patientId,
        }),
      });
    },
  });
};

export const usePatientVitalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: CreatePatientVitalRequest & {
        patientId: string;
        visitId: string;
      },
    ) =>
      HttpService.post<CreatePatientVitalRequest>(
        `v1/visit/vital/${data.patientId}/${data.visitId}`,
        data,
      ),
    onSuccess: (res, req) => {
      queryClient.invalidateQueries({
        queryKey: VisitQueryKey({
          visitId: req.visitId,
          patientId: req.patientId,
        }),
      });
    },
  });
};

export const usePatientPrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      patientId: string;
      visitId: string;
      prescription: CreatePatientPrescriptionRequest;
    }) =>
      HttpService.post<CreatePatientPrescriptionRequest>(
        `v1/visit/prescription/${data.patientId}/${data.visitId}`,
        data.prescription,
      ),
    onSuccess: (res, req) => {
      queryClient.invalidateQueries({
        queryKey: VisitQueryKey({
          visitId: req.visitId,
          patientId: req.patientId,
        }),
      });
    },
  });
};

type CreatePatientVisit = CreatePatientVisitRequest & {
  patientId: string;
};

export const usePatientVisitMutation = (
  options: UseMutationOptions<PatientVisit, unknown, CreatePatientVisit>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (param: CreatePatientVisit) =>
      HttpService.post<PatientVisit>(`/v1/visit/${param.patientId}`, param),
    onSuccess: (...args) => {
      options.onSuccess?.(...args);
      queryClient.invalidateQueries({
        queryKey: ['patient-visit'],
      });
    },
  });
};

export const usePatientVisitByIdQuery = (
  param: VisitIdPatientId,
  options?: UseQueryOptions<DetailedPatientVisit>,
) => {
  return useQuery({
    queryKey: VisitQueryKey(param),
    queryFn: () =>
      HttpService.get<DetailedPatientVisit>(
        `/v1/visit/${param.patientId}/${param.visitId}`,
      ),
    ...options,
  });
};

export const usePatientVisitCheckoutMutation = (
  options: UseMutationOptions<CreatePatientVisit, unknown, VisitIdPatientId>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (param) =>
      HttpService.post<CreatePatientVisit>(
        `/v1/visit/checkout/${param.patientId}/${param.visitId}`,
      ),
    onSuccess: (res, req) => {
      queryClient.invalidateQueries({
        queryKey: VisitQueryKey({
          visitId: req.visitId,
          patientId: req.patientId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: ['patient', req.patientId],
      });
    },
  });
};
