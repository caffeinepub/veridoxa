import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAllWorks, useDeleteWork, usePublishWork } from '../../hooks/useAdminWorks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, EyeOff, FileText, ArrowLeft } from 'lucide-react';
import QueryState from '../../components/feedback/QueryState';

export default function AdminWorksPage() {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<bigint | null>(null);

  const { data: works, isLoading } = useAllWorks();
  const deleteMutation = useDeleteWork();
  const publishMutation = usePublishWork();

  const handleDelete = (id: bigint) => {
    setWorkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (workToDelete) {
      deleteMutation.mutate(workToDelete);
      setDeleteDialogOpen(false);
      setWorkToDelete(null);
    }
  };

  const handlePublishToggle = (id: bigint, published: boolean) => {
    publishMutation.mutate({ id, published: !published });
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight">Manage Works</h1>
            <p className="mt-2 text-muted-foreground">Upload and manage your published works</p>
          </div>
          <Button onClick={() => navigate({ to: '/admin/works/upload' })} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Upload Work
          </Button>
        </header>

        <QueryState
          isLoading={isLoading}
          isEmpty={works?.length === 0}
          emptyMessage="No works yet. Upload your first work using the button above!"
        />

        <div className="grid gap-4">
          {works?.map((work) => (
            <Card key={work.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <CardTitle className="font-serif">{work.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created {formatDate(work.createdAt)}
                      </CardDescription>
                      {work.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{work.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={work.published ? 'default' : 'secondary'}>
                    {work.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublishToggle(work.id, work.published)}
                    disabled={publishMutation.isPending}
                  >
                    {work.published ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(work.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the work and its file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
