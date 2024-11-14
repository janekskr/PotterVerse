import { useInfiniteQuery } from "@tanstack/react-query";
import { CharactersResponse, fetchCharacters } from "@/lib/api";

export const useCharacters = (pageSize: number = 20) => {
  return useInfiniteQuery<
    any,
    Error,
    any,
    [string, number],
    number
  >({
    queryKey: ["characters", pageSize],
    queryFn: ({ pageParam }) => fetchCharacters(pageParam || 1, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.pagination.next ?? undefined,
    staleTime: Infinity,
  });
};
