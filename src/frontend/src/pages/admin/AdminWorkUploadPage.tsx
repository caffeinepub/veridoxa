import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateWork } from '../../hooks/useAdminWorks';
import { useIsAdmin } from '../../hooks/useAuthz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export default function AdminWorkUploadPage() {
  const navigate = useNavigate();
  const createMutation = useCreateWork();
  const { data: isAdmin, isAdminSetupIncomplete, initializationError } = useIsAdmin();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        file: externalBlob,
      });

      navigate({ to: '/admin/works' });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const isUploading = createMutation.isPending;
  const showAdminWarning = !!(isAdminSetupIncomplete || initializationError || !isAdmin);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin/works' })}
          className="mb-6"
          disabled={isUploading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Works
        </Button>

        {showAdminWarning && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Admin Access Issue</AlertTitle>
            <AlertDescription>
              {initializationError || 'Your admin access could not be verified. Please log out and log back in with the admin token link to ensure you can upload works.'}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-3xl">Upload Work</CardTitle>
            <CardDescription>
              Upload a PDF or other document to share with your readers. The file will be available for viewing and download once published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter work title"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description or summary"
                  rows={4}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  required
                  disabled={isUploading}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isUploading || !file || !title.trim() || showAdminWarning}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload Work'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/admin/works' })}
                  disabled={isUploading}
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
