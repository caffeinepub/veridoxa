import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import { type Entry, Section } from '../backend';

export function usePublishedEntries(section: Section) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: queryKeys.entries.bySection(section),
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.listPublishedBySection(section);
      return entries.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useEntry(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Entry>({
    queryKey: queryKeys.entries.detail(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEntry(id);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
