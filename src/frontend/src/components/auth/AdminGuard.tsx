import { type ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAuthz';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isAdminSetupIncomplete, initializationError } = useIsAdmin();

  if (isInitializing || isAdminLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Alert className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="mt-2">
            You must be logged in to access this area. Admin access is required to manage content and upload works.
            <div className="mt-4">
              <Button asChild>
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAdminSetupIncomplete || initializationError) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Alert className="max-w-md" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Admin Setup Incomplete</AlertTitle>
          <AlertDescription className="mt-2">
            {initializationError || 'Admin access could not be initialized. Please ensure you have the correct admin token and try logging in again with the admin access link.'}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Next steps:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Log out and log back in with the admin token link</li>
                <li>Ensure the admin token parameter is included in the URL</li>
                <li>Contact the site administrator if the issue persists</li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Alert className="max-w-md" variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access this area. Admin privileges are required to manage entries, upload works, and perform other administrative tasks.
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">To gain admin access:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Log out and use the admin access link with the token parameter</li>
                <li>Ensure you're logging in with the correct admin account</li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
