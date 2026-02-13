import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePublishedEntries } from '../../hooks/useEntries';
import { useDeleteEntry, usePublishEntry } from '../../hooks/useAdminEntries';
import { Section } from '../../backend';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Upload } from 'lucide-react';
import QueryState from '../../components/feedback/QueryState';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{ id: bigint; section: Section } | null>(null);

  const { data: researchEntries, isLoading: researchLoading } = usePublishedEntries(Section.research);
  const { data: storytellingEntries, isLoading: storytellingLoading } = usePublishedEntries(Section.storytelling);
  const { data: poetryEntries, isLoading: poetryLoading } = usePublishedEntries(Section.poetry);

  const deleteMutation = useDeleteEntry();
  const publishMutation = usePublishEntry();

  const handleDelete = (id: bigint, section: Section) => {
    setEntryToDelete({ id, section });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate(entryToDelete);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handlePublishToggle = (id: bigint, published: boolean, section: Section) => {
    publishMutation.mutate({ id, published: !published, section });
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderEntryCard = (entry: any, section: Section) => (
    <Card key={entry.id.toString()}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="font-serif">{entry.title}</CardTitle>
            <CardDescription className="mt-1">
              Created {formatDate(entry.createdAt)}
            </CardDescription>
          </div>
          <Badge variant={entry.published ? 'default' : 'secondary'}>
            {entry.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate({ to: '/admin/edit/$id', params: { id: entry.id.toString() } })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePublishToggle(entry.id, entry.published, section)}
            disabled={publishMutation.isPending}
          >
            {entry.published ? (
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
            onClick={() => handleDelete(entry.id, section)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage your published content and works</p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manage Works
              </CardTitle>
              <CardDescription>
                Upload and manage your published works (PDFs, documents)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button onClick={() => navigate({ to: '/admin/works' })} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Works
              </Button>
              <Button
                onClick={() => navigate({ to: '/admin/works/upload' })}
                variant="outline"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New Work
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Entry
              </CardTitle>
              <CardDescription>
                Write new research, storytelling, or poetry entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/admin/new' })} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="research">
          <TabsList className="mb-8">
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="storytelling">Storytelling</TabsTrigger>
            <TabsTrigger value="poetry">Poetry</TabsTrigger>
          </TabsList>

          <TabsContent value="research">
            <QueryState
              isLoading={researchLoading}
              isEmpty={researchEntries?.length === 0}
              emptyMessage="No research entries yet. Create your first one!"
            />
            <div className="grid gap-4">
              {researchEntries?.map((entry) => renderEntryCard(entry, Section.research))}
            </div>
          </TabsContent>

          <TabsContent value="storytelling">
            <QueryState
              isLoading={storytellingLoading}
              isEmpty={storytellingEntries?.length === 0}
              emptyMessage="No storytelling entries yet. Create your first one!"
            />
            <div className="grid gap-4">
              {storytellingEntries?.map((entry) => renderEntryCard(entry, Section.storytelling))}
            </div>
          </TabsContent>

          <TabsContent value="poetry">
            <QueryState
              isLoading={poetryLoading}
              isEmpty={poetryEntries?.length === 0}
              emptyMessage="No poetry entries yet. Create your first one!"
            />
            <div className="grid gap-4">
              {poetryEntries?.map((entry) => renderEntryCard(entry, Section.poetry))}
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the entry.
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
