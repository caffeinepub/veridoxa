import { usePublishedWorks } from '../hooks/useWorks';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import QueryState from '../components/feedback/QueryState';

export default function WorksListPage() {
  const { data: works, isLoading, isError, error } = usePublishedWorks();
  const navigate = useNavigate();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getFileExtension = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const ext = pathname.split('.').pop()?.toLowerCase() || '';
      return ext;
    } catch {
      return '';
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight">Works</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Published books, papers, and other literary works
          </p>
        </header>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={works?.length === 0}
          emptyMessage="No works have been published yet."
        />

        <div className="grid gap-6">
          {works?.map((work) => {
            const fileExt = getFileExtension(work.file.getDirectURL());
            const isPDF = fileExt === 'pdf';

            return (
              <Card key={work.id.toString()} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-2xl">{work.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Published {formatDate(work.createdAt)}
                      </CardDescription>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {work.description && (
                    <p className="mb-4 text-muted-foreground">{work.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {isPDF ? (
                      <Button
                        onClick={() => navigate({ to: '/works/$id', params: { id: work.id.toString() } })}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    ) : (
                      <Button asChild>
                        <a href={work.file.getDirectURL()} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
