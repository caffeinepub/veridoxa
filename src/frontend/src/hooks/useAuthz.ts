import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.auth.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
