import { useParams, useNavigate } from '@tanstack/react-router';
import { useWork } from '../hooks/useWorks';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import QueryState from '../components/feedback/QueryState';

export default function WorkDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const workId = id ? BigInt(id) : BigInt(0);
  const { data: work, isLoading, isError, error } = useWork(workId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading || isError || !work) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <QueryState isLoading={isLoading} isError={isError} error={error} />
        </div>
      </div>
    );
  }

  const pdfUrl = work.file.getDirectURL();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/works' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Works
        </Button>

        <header className="mb-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight">{work.title}</h1>
          <p className="mt-2 text-muted-foreground">Published {formatDate(work.createdAt)}</p>
          {work.description && (
            <p className="mt-4 text-lg text-muted-foreground">{work.description}</p>
          )}
          <div className="mt-4">
            <Button asChild variant="outline">
              <a href={pdfUrl} download>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </header>

        <div className="rounded-lg border bg-card">
          <iframe
            src={pdfUrl}
            className="h-[80vh] w-full rounded-lg"
            title={work.title}
          />
        </div>
      </div>
    </div>
  );
}
