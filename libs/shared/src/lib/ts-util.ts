import { HttpError } from './http-error';

export type Maybe<T> = T | null | undefined;
export type Sure<T> = Exclude<T, null | undefined>;
// Explicit type annotation for the 'ensure' function
export const ensure: (
  value: unknown,
  message?: string | Error,
) => asserts value = (value, message) => {
  const isFalsy = value == null || value === false;
  if (!isFalsy) {
    return;
  }
  if (message instanceof Error) {
    throw message;
  }
  throw new HttpError(message ?? 'Something went wrong');
};

type OnlyObject = Record<string, unknown>;

export interface PaginatedResponse<T extends OnlyObject> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PaginateParams {
  page: number;
  limit: number;
}

export type SortField = Maybe<{
  field: string;
  order: 'desc' | 'asc';
}>;

export type PaginateParamsWithSort = {
  paginate: PaginateParams;
  sort?: SortField;
  search: Maybe<string>;
};

export const validateSortField = (sort: unknown): sort is SortField => {
  if (!sort) {
    return true;
  }
  if (typeof sort !== 'object') {
    return false;
  }
  const sortField = sort as SortField;
  if (!sortField?.field || !sortField.order) {
    return false;
  }
  const isOrderValid = sortField.order === 'asc' || sortField.order === 'desc';
  return isOrderValid;
};

export const validatePaginateParams = (
  params: unknown,
): params is PaginateParams => {
  const paginateParams = params as PaginateParams;
  if (!paginateParams) {
    return true;
  }
  const isPaginateValid =
    typeof paginateParams.page !== 'number' ||
    typeof paginateParams.limit !== 'number';
  if (isPaginateValid) {
    return true;
  }
  return false;
};

export const validatePaginateParamsWithSort = (
  params: unknown,
): params is PaginateParamsWithSort => {
  const paginateParams = params as PaginateParamsWithSort;
  if (!paginateParams) {
    return false;
  }
  const isPaginateValid =
    !Number.isNaN(paginateParams.paginate.page) &&
    !Number.isNaN(paginateParams.paginate.limit);
  if (!isPaginateValid) {
    return false;
  }
  (params as PaginateParamsWithSort).paginate.page = Number(
    paginateParams.paginate.page,
  );
  (params as PaginateParamsWithSort).paginate.limit = Number(
    paginateParams.paginate.limit,
  );
  if (paginateParams.sort) {
    return validateSortField(paginateParams.sort);
  }
  return true;
};

export const validateSearch = (search: unknown): search is Maybe<string> => {
  if (!search) {
    return true;
  }
  return typeof search === 'string';
};
