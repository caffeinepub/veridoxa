import { Section } from '../backend';
import { usePublishedEntries } from '../hooks/useEntries';
import EntryList from '../components/content/EntryList';
import QueryState from '../components/feedback/QueryState';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

interface SectionListPageProps {
  section: 'research' | 'storytelling' | 'poetry';
}

export default function SectionListPage({ section }: SectionListPageProps) {
  const { data: entries, isLoading, isError, error } = usePublishedEntries(section as Section);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    if (!entries) return [];
    const tagSet = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (!selectedTag) return entries;
    return entries.filter((entry) => entry.tags.includes(selectedTag));
  }, [entries, selectedTag]);

  const sectionTitles = {
    research: 'Research',
    storytelling: 'Storytelling',
    poetry: 'Poetry',
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            {sectionTitles[section]}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {section === 'research' && 'In-depth research works and academic writings'}
            {section === 'storytelling' && 'Narratives and creative prose'}
            {section === 'poetry' && 'Verse and poetic expressions'}
          </p>
        </header>

        {allTags.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Filter by tag</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                  {selectedTag === tag && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={filteredEntries?.length === 0}
          emptyMessage={selectedTag ? `No entries found with tag "${selectedTag}".` : 'No entries found.'}
        />

        {filteredEntries && <EntryList entries={filteredEntries} section={section} />}
      </div>
    </div>
  );
}
