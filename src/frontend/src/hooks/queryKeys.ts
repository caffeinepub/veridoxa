import { Section } from '../backend';

export const queryKeys = {
  entries: {
    all: ['entries'] as const,
    bySection: (section: Section) => ['entries', 'section', section] as const,
    detail: (id: bigint) => ['entries', 'detail', id.toString()] as const,
  },
  search: {
    all: ['search'] as const,
    query: (term: string, section?: Section) => ['search', term, section] as const,
  },
  auth: {
    isAdmin: ['auth', 'isAdmin'] as const,
  },
  works: {
    all: ['works'] as const,
    published: ['works', 'published'] as const,
    detail: (id: bigint) => ['works', 'detail', id.toString()] as const,
  },
};
