import { useInternetIdentity } from './useInternetIdentity';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';
import { getSecretParameter } from '../utils/urlParams';

const ACTOR_QUERY_KEY = 'robust-actor';

interface RobustActorState {
  actor: backendInterface | null;
  isFetching: boolean;
  isAdminSetupIncomplete: boolean;
  initializationError: string | null;
}

export function useRobustActor(): RobustActorState {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isAdminSetupIncomplete, setIsAdminSetupIncomplete] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      if (!isAuthenticated) {
        // Return anonymous actor if not authenticated
        setIsAdminSetupIncomplete(false);
        setInitializationError(null);
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity
        }
      };

      const actor = await createActorWithConfig(actorOptions);
      
      // Only initialize access control if we have a non-empty admin token
      const adminToken = getSecretParameter('caffeineAdminToken');
      
      if (adminToken && adminToken.trim().length > 0) {
        try {
          await actor._initializeAccessControlWithSecret(adminToken);
          setIsAdminSetupIncomplete(false);
          setInitializationError(null);
        } catch (error) {
          console.error('Access control initialization failed:', error);
          setInitializationError('Failed to initialize admin access. Please check your admin token.');
          setIsAdminSetupIncomplete(true);
        }
      } else {
        // No admin token provided - mark as incomplete but don't fail
        // This allows the app to work for non-admin users
        setIsAdminSetupIncomplete(false);
        setInitializationError(null);
      }
      
      return actor;
    },
    staleTime: Infinity,
    enabled: true,
    retry: false,
  });

  // When the actor changes, invalidate dependent queries
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
    isAdminSetupIncomplete,
    initializationError,
  };
}
