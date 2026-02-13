import { useQuery } from '@tanstack/react-query';
import { useRobustActor } from './useRobustActor';
import { queryKeys } from './queryKeys';
import { type Work } from '../backend';

export function usePublishedWorks() {
  const { actor, isFetching: actorFetching } = useRobustActor();

  return useQuery<Work[]>({
    queryKey: queryKeys.works.published,
    queryFn: async () => {
      if (!actor) return [];
      const works = await actor.listPublishedWorks();
      return works.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useWork(id: bigint) {
  const { actor, isFetching: actorFetching } = useRobustActor();

  return useQuery<Work>({
    queryKey: queryKeys.works.detail(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWork(id);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
