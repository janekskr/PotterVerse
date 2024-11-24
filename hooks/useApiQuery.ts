import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFromApi } from "@/lib/api";
import { ApiType, FilterQuery, Pagination } from "@/lib/types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

interface UseApiQueryProps {
  type: ApiType;
  pageSize?: number;
  filterQuery?: FilterQuery
}

export const useApiQuery = <T>({
  type,
  filterQuery,
  pageSize = 50,
}: UseApiQueryProps) => {
  return useInfiniteQuery<
    PaginatedResponse<T>,   
    Error,
    {
      pages: T[]
    },             
    [ApiType, number, FilterQuery | undefined],
    number
  >({
    queryKey: [type, pageSize, filterQuery],
    queryFn: async ({ pageParam = 1 }) => fetchFromApi<T>(type, pageParam, pageSize, filterQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.next ?? undefined,
  });
};
