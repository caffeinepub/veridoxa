import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProseProps {
  children: ReactNode;
  className?: string;
}

export default function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-headings:font-serif prose-headings:font-semibold',
        'prose-h1:text-4xl prose-h1:tracking-tight',
        'prose-h2:text-3xl prose-h2:tracking-tight',
        'prose-h3:text-2xl',
        'prose-p:leading-relaxed prose-p:text-foreground/90',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:font-semibold prose-strong:text-foreground',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        'prose-blockquote:border-l-primary prose-blockquote:italic',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:marker:text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  );
}
