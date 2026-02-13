import { useQuery } from '@tanstack/react-query';
import { useRobustActor } from './useRobustActor';
import { queryKeys } from './queryKeys';

export function useIsAdmin() {
  const { actor, isFetching: actorFetching, isAdminSetupIncomplete, initializationError } = useRobustActor();

  const query = useQuery<boolean>({
    queryKey: queryKeys.auth.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !isAdminSetupIncomplete,
    retry: false,
  });

  return {
    ...query,
    isAdminSetupIncomplete,
    initializationError,
  };
}
