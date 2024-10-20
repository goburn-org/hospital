import { PaginateParams, SortField } from '@hospital/shared';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const toSortField = (sort: MRT_SortingState): SortField => {
  return sort.length
    ? {
        field: sort[0].id,
        order: sort[0].desc ? 'desc' : 'asc',
      }
    : undefined;
};

export const toPagination = (
  pagination: MRT_PaginationState,
): PaginateParams => {
  return {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
};
