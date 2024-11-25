import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';
import {
  AssessmentResponse,
  CreateAssessmentRequest,
  CreatePatientVisitRequest,
  DetailedPatientVisit,
  PatientVisit,
} from '@hospital/shared';

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
