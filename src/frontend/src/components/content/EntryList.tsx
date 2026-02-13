import { type Entry } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { Calendar } from 'lucide-react';

interface EntryListProps {
  entries: Entry[];
  section: string;
}

export default function EntryList({ entries, section }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">No entries found.</p>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="grid gap-6">
      {entries.map((entry) => (
        <Link
          key={entry.id.toString()}
          to="/$section/$id"
          params={{ section, id: entry.id.toString() }}
        >
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-serif">{entry.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(entry.createdAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {(entry.excerpt || entry.tags.length > 0) && (
              <CardContent>
                {entry.excerpt && <p className="text-muted-foreground">{entry.excerpt}</p>}
                {entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
