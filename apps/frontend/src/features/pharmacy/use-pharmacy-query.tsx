import {
  CounterSaleAvailabilityInput,
  CounterSaleResponse,
  CreateGrnRequest,
  CreateIntentRequest,
  GrnResponse,
  IntentResponse,
  PaginatedResponse,
  PaginateParamsWithSort,
} from '@hospital/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

export const usePatientPrescriptionQuery = (
  queryParams: PaginateParamsWithSort,
) => {
  return useQuery({
    queryKey: ['pharmacy', queryParams],
    queryFn: () => {
      return HttpService.get<PaginatedResponse<CounterSaleResponse>>(
        '/v1/pharmacy',
        {
          params: queryParams,
        },
      );
    },
  });
};

export const useIntentQuery = () => {
  return useQuery({
    queryKey: ['intent'],
    queryFn: () => {
      return HttpService.get<IntentResponse[]>('/v1/intent');
    },
  });
};

export const usePatientPrescriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CounterSaleAvailabilityInput) => {
      return HttpService.post<CounterSaleAvailabilityInput>(
        '/v1/pharmacy',
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'pharmacy',
      });
    },
  });
};

export const useIntentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIntentRequest) => {
      return HttpService.post<IntentResponse>('/v1/intent', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'intent',
      });
    },
  });
};

export const useGrnQuery = () => {
  return useQuery({
    queryKey: ['grn'],
    queryFn: () => {
      return HttpService.get<GrnResponse[]>('/v1/grn');
    },
  });
};

export const useGrnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGrnRequest) => {
      return HttpService.post<GrnResponse>('/v1/grn', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'grn',
      });
    },
  });
};

export const useGrnByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['grn', id],
    queryFn: () => {
      return HttpService.get<GrnResponse>(`/v1/grn/${id}`);
    },
  });
};
