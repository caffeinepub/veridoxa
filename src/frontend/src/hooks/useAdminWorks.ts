import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRobustActor } from './useRobustActor';
import { queryKeys } from './queryKeys';
import { type Work, ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/authErrorMessages';

export function useAllWorks() {
  const { actor, isFetching: actorFetching } = useRobustActor();

  return useQuery<Work[]>({
    queryKey: queryKeys.works.adminAll,
    queryFn: async () => {
      if (!actor) return [];
      const works = await actor.listAllWorks();
      return works.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateWork() {
  const { actor } = useRobustActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWork(data.title, data.description, data.file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.adminAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      toast.success('Work uploaded successfully');
    },
    onError: (error: Error) => {
      if (error.message.includes('exceeds maximum')) {
        toast.error('File size exceeds maximum allowed size');
      } else {
        const message = getErrorMessage(error, 'Failed to upload work');
        toast.error(message);
      }
    },
  });
}

export function useUpdateWork() {
  const { actor } = useRobustActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWork(data.id, data.title, data.description);
    },
    onSuccess: (work) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.adminAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.detail(work.id) });
      toast.success('Work updated successfully');
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error, 'Failed to update work');
      toast.error(message);
    },
  });
}

export function useDeleteWork() {
  const { actor } = useRobustActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteWork(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.adminAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      toast.success('Work deleted successfully');
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error, 'Failed to delete work');
      toast.error(message);
    },
  });
}

export function usePublishWork() {
  const { actor } = useRobustActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.publishWork(data.id, data.published);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.adminAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.detail(data.id) });
      toast.success(data.published ? 'Work published' : 'Work unpublished');
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error, 'Failed to update publish status');
      toast.error(message);
    },
  });
}
