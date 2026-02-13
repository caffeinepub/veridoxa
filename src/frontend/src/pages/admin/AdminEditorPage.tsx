import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useEntry } from '../../hooks/useEntries';
import { useCreateEntry, useUpdateEntry } from '../../hooks/useAdminEntries';
import { Section } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import QueryState from '../../components/feedback/QueryState';

export default function AdminEditorPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const id = params.id;
  const isEditing = !!id;

  const { data: entry, isLoading } = useEntry(isEditing ? BigInt(id) : BigInt(0));
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry();

  const [section, setSection] = useState<Section>(Section.research);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (entry) {
      setSection(entry.section);
      setTitle(entry.title);
      setExcerpt(entry.excerpt || '');
      setBody(entry.body);
      setTags(entry.tags.join(', '));
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data = {
      section,
      title,
      body,
      tags: tagArray,
      excerpt: excerpt.trim() || null,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: BigInt(id), ...data });
    } else {
      await createMutation.mutateAsync(data);
    }

    navigate({ to: '/admin' });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return (
      <div className="container py-12">
        <QueryState isLoading={true} />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/admin' })} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-3xl">
              {isEditing ? 'Edit Entry' : 'Create New Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select value={section} onValueChange={(value) => setSection(value as Section)}>
                  <SelectTrigger id="section">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Section.research}>Research</SelectItem>
                    <SelectItem value={Section.storytelling}>Storytelling</SelectItem>
                    <SelectItem value={Section.poetry}>Poetry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary or excerpt"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., philosophy, science, nature"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  placeholder="Write your content here..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? 'Saving...' : isEditing ? 'Update Entry' : 'Create Entry'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/admin' })}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
