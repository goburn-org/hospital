import { BankAccountCreate, BankAccountResponse } from '@hospital/shared';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../utils/http';

export const useBankAccounts = () => {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => HttpService.get<BankAccountResponse>('/v1/bank-account'),
  });
};

export const useBankAccountCreateMutation = (
  options: UseMutationOptions<
    BankAccountResponse[number],
    unknown,
    BankAccountCreate
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BankAccountCreate) =>
      HttpService.post<BankAccountResponse[number]>('/v1/bank-account', data),
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
};

export const useBankAccountEditMutation = (
  options: UseMutationOptions<
    BankAccountResponse[number],
    unknown,
    BankAccountCreate
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BankAccountCreate & { id: string }) =>
      HttpService.put<BankAccountResponse[number]>(
        `/v1/bank-account/${data.id}`,
        data,
      ),
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
};

export const useBankAccountActiveMutation = (
  options?: UseMutationOptions<
    BankAccountResponse[number],
    unknown,
    { id: number; isActive: boolean }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; isActive: boolean }) =>
      HttpService.post<BankAccountResponse[number]>(
        `/v1/bank-account/${data.id}/active`,
        data,
      ),
    ...(options || {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
};
