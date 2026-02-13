import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section } from '../backend';
import EntryList from '../components/content/EntryList';
import QueryState from '../components/feedback/QueryState';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<Section | undefined>(undefined);
  const { data: results, isLoading, isError, error } = useSearch(searchTerm, sectionFilter);

  const handleTabChange = (value: string) => {
    if (value === 'all') {
      setSectionFilter(undefined);
    } else {
      setSectionFilter(value as Section);
    }
  };

  const getSectionName = (section: Section) => {
    const names = {
      [Section.research]: 'research',
      [Section.storytelling]: 'storytelling',
      [Section.poetry]: 'poetry',
    };
    return names[section];
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Search</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Search across all published entries
          </p>
        </header>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchTerm.trim() && (
          <>
            <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value={Section.research}>Research</TabsTrigger>
                <TabsTrigger value={Section.storytelling}>Storytelling</TabsTrigger>
                <TabsTrigger value={Section.poetry}>Poetry</TabsTrigger>
              </TabsList>
            </Tabs>

            <QueryState
              isLoading={isLoading}
              isError={isError}
              error={error}
              isEmpty={results?.length === 0}
              emptyMessage={`No results found for "${searchTerm}".`}
            />

            {results && results.length > 0 && (
              <EntryList
                entries={results}
                section={results[0] ? getSectionName(results[0].section) : 'research'}
              />
            )}
          </>
        )}

        {!searchTerm.trim() && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-lg text-muted-foreground">Enter a search term to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
