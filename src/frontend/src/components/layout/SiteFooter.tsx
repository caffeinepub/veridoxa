import { Link } from '@tanstack/react-router';
import { Separator } from '@/components/ui/separator';
import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'veridoxa'
  );

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link to="/introduction" className="text-muted-foreground hover:text-foreground">
              Introduction
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/research" className="text-muted-foreground hover:text-foreground">
              Research
            </Link>
            <Link to="/storytelling" className="text-muted-foreground hover:text-foreground">
              Storytelling
            </Link>
            <Link to="/poetry" className="text-muted-foreground hover:text-foreground">
              Poetry
            </Link>
            <Link to="/works" className="text-muted-foreground hover:text-foreground">
              Works
            </Link>
            <Link to="/search" className="text-muted-foreground hover:text-foreground">
              Search
            </Link>
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} veridoxa. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
