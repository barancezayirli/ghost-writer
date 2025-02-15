import { getTextStats } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface BlogPostCardProps {
  content: string;
  className?: string;
}

export function BlogPostCard({ content, className }: BlogPostCardProps) {
  const sanitizedContent = sanitizeHtml(content);
  const { words, characters } = getTextStats(content);

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </CardContent>
      <CardFooter className="justify-end items-center text-sm text-muted-foreground gap-3 bg-muted py-4">
        <span>{words} words</span>
        <span>{characters} characters</span>
      </CardFooter>
    </Card>
  );
}
