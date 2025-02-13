import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KeywordManagerProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

export function KeywordManager({ keywords, onAddKeyword, onRemoveKeyword }: KeywordManagerProps) {
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleAdd = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      onAddKeyword(currentKeyword.trim());
      setCurrentKeyword('');
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-sm px-2 py-1">
                {keyword}
                <button
                  onClick={() => onRemoveKeyword(keyword)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add keywords..."
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
              className="flex-grow"
            />
            <Button onClick={handleAdd} variant="secondary" size="sm">
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
