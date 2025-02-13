import RichTextEditor from '@/components/blocks/rich-text-editor';
import { FeedbackButtons } from './feedback-buttons';
import { ContentUpdateForm } from '@/components/ghost-writer/content-update-form';

interface GeneratedContentProps {
  content: string;
  onRetry: () => void;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
  onUpdate: (update: string) => void;
}

export function GeneratedContent({
  content,
  onRetry,
  onLike,
  onDislike,
  onCopy,
  onUpdate,
}: GeneratedContentProps) {
  return (
    <div className="space-y-4 mt-8 border-t pt-8">
      <RichTextEditor content={content} />
      <FeedbackButtons onRetry={onRetry} onLike={onLike} onDislike={onDislike} onCopy={onCopy} />
      <ContentUpdateForm onUpdate={onUpdate} />
    </div>
  );
}
