import { useInfiniteQuery } from "@tanstack/react-query"
import { CharactersResponse, fetchCharacters } from "@/lib/api"

export const useCharacters = (pageSize: number = 20, filterQuery: string = "") => {
  return useInfiniteQuery<
    any,
    Error,
    any,
    [string, number, string],
    number
  >({
    queryKey: ["characters", pageSize, filterQuery],
    queryFn: ({ pageParam }) => {
      return fetchCharacters(pageParam || 1, pageSize, filterQuery)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.pagination.next ?? undefined,
  })
}