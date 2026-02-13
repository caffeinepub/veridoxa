import { useParams, useNavigate } from '@tanstack/react-router';
import { useEntry } from '../hooks/useEntries';
import QueryState from '../components/feedback/QueryState';
import Prose from '../components/content/Prose';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function EntryDetailPage() {
  const { section, id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: entry, isLoading, isError, error } = useEntry(BigInt(id || '0'));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleBack = () => {
    navigate({ to: `/${section}` });
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" onClick={handleBack} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {section}
        </Button>

        <QueryState isLoading={isLoading} isError={isError} error={error} />

        {entry && (
          <article>
            <header className="mb-8">
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{entry.title}</h1>
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time>{formatDate(entry.createdAt)}</time>
              </div>
              {entry.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <Prose>
              <div dangerouslySetInnerHTML={{ __html: entry.body.replace(/\n/g, '<br />') }} />
            </Prose>
          </article>
        )}
      </div>
    </div>
  );
}
