import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import { type Work, ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function useAllWorks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Work[]>({
    queryKey: queryKeys.works.all,
    queryFn: async () => {
      if (!actor) return [];
      const works = await actor.listPublishedWorks();
      return works.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateWork() {
  const { actor } = useActor();
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
      queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      toast.success('Work uploaded successfully');
    },
    onError: (error: Error) => {
      const message = error.message.includes('exceeds maximum')
        ? 'File size exceeds maximum allowed size'
        : `Failed to upload work: ${error.message}`;
      toast.error(message);
    },
  });
}

export function useUpdateWork() {
  const { actor } = useActor();
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
      queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.detail(work.id) });
      toast.success('Work updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update work: ${error.message}`);
    },
  });
}

export function useDeleteWork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteWork(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      toast.success('Work deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete work: ${error.message}`);
    },
  });
}

export function usePublishWork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.publishWork(data.id, data.published);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.published });
      queryClient.invalidateQueries({ queryKey: queryKeys.works.detail(data.id) });
      toast.success(data.published ? 'Work published' : 'Work unpublished');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    },
  });
}
