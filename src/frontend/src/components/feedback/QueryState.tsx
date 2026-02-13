import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface QueryStateProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingRows?: number;
}

export function QueryStateLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function QueryStateError({ error }: { error?: Error | null }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error?.message || 'An error occurred while loading data.'}</AlertDescription>
    </Alert>
  );
}

export function QueryStateEmpty({ message = 'No data found.' }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}

export default function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage,
  loadingRows = 3,
}: QueryStateProps) {
  if (isLoading) {
    return <QueryStateLoading rows={loadingRows} />;
  }

  if (isError) {
    return <QueryStateError error={error} />;
  }

  if (isEmpty) {
    return <QueryStateEmpty message={emptyMessage} />;
  }

  return null;
}
