import { Button } from '@/components/ui/button';
import { RefreshCw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

interface FeedbackButtonsProps {
  onRetry: () => void;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
}

export function FeedbackButtons({ onRetry, onLike, onDislike, onCopy }: FeedbackButtonsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <Button variant="outline" size="icon" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onLike}>
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDislike}>
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
