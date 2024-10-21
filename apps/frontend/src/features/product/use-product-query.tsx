import {
  CreateProductInput,
  PaginatedResponse,
  PaginateParamsWithSort,
  ProductResponse,
  UpdateProductInput,
} from '@hospital/shared';
import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { HttpService } from '../../utils/http';

const queryKey = ['product'];

export const useProductQuery = (
  queryParams: PaginateParamsWithSort,
  options?: QueryOptions<PaginatedResponse<ProductResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, queryParams],
    queryFn: () =>
      HttpService.get<PaginatedResponse<ProductResponse>>('/v1/product', {
        params: queryParams,
      }),
  });
};

export const useAllProductQuery = (
  options?: QueryOptions<PaginatedResponse<ProductResponse>>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, 'all'],
    queryFn: () =>
      HttpService.get<PaginatedResponse<ProductResponse>>('/v1/products'),
  });
};

export const useProductByIdQuery = (
  id: string,
  options?: QueryOptions<ProductResponse>,
) => {
  return useQuery({
    ...(options || {}),
    queryKey: [...queryKey, id],
    queryFn: () => HttpService.get<ProductResponse>(`/v1/product/${id}`),
  });
};

export const useCreateProductMutation = (
  options?: UseMutationOptions<ProductResponse, unknown, CreateProductInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: CreateProductInput) =>
      HttpService.post<ProductResponse>('/v1/product', data),
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

export const useUpdateProductMutation = (
  options?: UseMutationOptions<ProductResponse, unknown, UpdateProductInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: (data: UpdateProductInput) =>
      HttpService.put<ProductResponse>(`/v1/product/${data.id}`, data),
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
