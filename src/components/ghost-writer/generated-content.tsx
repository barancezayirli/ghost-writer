import RichTextEditor from '@/components/form/rich-text-editor';
import { FeedbackButtons } from './feedback-buttons';
import { ContentUpdateForm } from '@/components/ghost-writer/content-update-form';

interface GeneratedContentProps {
  content: string;
  onRetry: () => void;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
  onClear: () => void;
  onUpdate: (update: string) => void;
}

export function GeneratedContent({
  content,
  onRetry,
  onLike,
  onDislike,
  onCopy,
  onClear,
  onUpdate,
}: GeneratedContentProps) {
  return (
    <div className=" mt-8 pt-8">
      <div className="space-y-4 mb-12">
        <RichTextEditor content={content} />
        <FeedbackButtons
          onRetry={onRetry}
          onLike={onLike}
          onDislike={onDislike}
          onCopy={onCopy}
          onClear={onClear}
        />
      </div>
      <ContentUpdateForm onUpdate={onUpdate} />
    </div>
  );
}
