import { Button } from '@/components/ui/button';
import { RefreshCw, ThumbsUp, ThumbsDown, Copy, Trash2 } from 'lucide-react';

interface FeedbackButtonsProps {
  onRetry: () => void;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export function FeedbackButtons({
  onRetry,
  onLike,
  onDislike,
  onCopy,
  onClear,
}: FeedbackButtonsProps) {
  return (
    <div className="flex justify-end space-x-1">
      <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 w-6">
        <RefreshCw className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onLike} className="h-6 w-6">
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDislike} className="h-6 w-6">
        <ThumbsDown className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onCopy} className="h-6 w-6">
        <Copy className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6">
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
