import { useQuery } from '@tanstack/react-query';
import { useRobustActor } from './useRobustActor';
import { queryKeys } from './queryKeys';
import { type Entry, Section } from '../backend';

export function useSearch(searchTerm: string, sectionFilter?: Section) {
  const { actor, isFetching: actorFetching } = useRobustActor();

  return useQuery<Entry[]>({
    queryKey: queryKeys.search.query(searchTerm, sectionFilter),
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      const results = await actor.searchEntries(searchTerm);
      
      let filtered = results;
      if (sectionFilter) {
        filtered = results.filter((entry) => entry.section === sectionFilter);
      }
      
      return filtered.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching && searchTerm.trim().length > 0,
  });
}
