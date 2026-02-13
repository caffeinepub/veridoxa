import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAuthz';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const navLinks = [
    { label: 'Introduction', path: '/introduction' },
    { label: 'Research', path: '/research' },
    { label: 'Storytelling', path: '/storytelling' },
    { label: 'Poetry', path: '/poetry' },
    { label: 'Works', path: '/works' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/veridoxa-logo.dim_512x128.png"
              alt="veridoxa"
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.label}
              </Link>
            ))}
            {identity && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/search' })}
            className="hidden sm:inline-flex"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <div className="hidden sm:block">
            <LoginButton />
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  to="/search"
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  Search
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-foreground' }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {identity && isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-foreground' }}
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="pt-4">
                  <LoginButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
