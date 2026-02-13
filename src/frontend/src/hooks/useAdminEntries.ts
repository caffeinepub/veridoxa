import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import { type Entry, Section } from '../backend';
import { toast } from 'sonner';

export function useCreateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      section: Section;
      title: string;
      body: string;
      tags: string[];
      excerpt: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEntry(data.section, data.title, data.body, data.tags, data.excerpt);
    },
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.bySection(entry.section) });
      toast.success('Entry created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create entry: ${error.message}`);
    },
  });
}

export function useUpdateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      section: Section;
      title: string;
      body: string;
      tags: string[];
      excerpt: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEntry(data.id, data.section, data.title, data.body, data.tags, data.excerpt);
    },
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.bySection(entry.section) });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.detail(entry.id) });
      toast.success('Entry updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update entry: ${error.message}`);
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; section: Section }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteEntry(data.id);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.bySection(data.section) });
      toast.success('Entry deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete entry: ${error.message}`);
    },
  });
}

export function usePublishEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; published: boolean; section: Section }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.publishEntry(data.id, data.published);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.bySection(data.section) });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.detail(data.id) });
      toast.success(data.published ? 'Entry published' : 'Entry unpublished');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    },
  });
}
