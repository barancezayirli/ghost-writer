import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize';

interface BlogPostCardProps {
  content: string;
  className?: string;
}

export function BlogPostCard({ content, className }: BlogPostCardProps) {
  const sanitizedContent = sanitizeHtml(content);

  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      <div className="p-6">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  );
}
