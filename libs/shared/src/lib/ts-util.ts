import { HttpError } from './http-error';
import moment from 'moment-timezone';

export type Maybe<T> = T | null | undefined;
export type Sure<T> = Exclude<T, null | undefined>;
export type DateLike = string | number | Date;
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
    !Number.isNaN(paginateParams.page) && !Number.isNaN(paginateParams.limit);
  if (!isPaginateValid) {
    return false;
  }
  (params as PaginateParams).page = Number(paginateParams.page);
  (params as PaginateParams).limit = Number(paginateParams.limit);
  return true;
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

export type NullOrUndefined<T> = T extends null | undefined
  ? undefined | null
  : T extends Date // Handle Date explicitly
    ? Date
    : T extends Array<infer U> // Handle arrays
      ? Array<NullOrUndefined<U>>
      : T extends object // Recursively handle objects
        ? { [K in keyof T]: NullOrUndefined<T[K]> }
        : T; // Primitive types remain unchanged

export const toDate = (date: DateLike) => {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};

export const humanizedDate = (rawDate: DateLike) => {
  const date = toDate(rawDate);
  const isInLast3Days = date.getDate() - new Date().getDate() <= 3;
  if (isInLast3Days) {
    return `${moment(date).fromNow()} (${moment(date).format('lll')})`;
  }
  const isToday = moment(date).isSame(new Date(), 'day');
  if (isToday) {
    return `Today (${moment(date).format('lll')})`;
  }
  return moment(date).format('lll');
};
