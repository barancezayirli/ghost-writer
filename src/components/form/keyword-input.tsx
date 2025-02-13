import { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { PromptFormData } from '@/types/ghost-writer';

interface KeywordInputProps {
  keywords: string[];
  setValue: UseFormSetValue<PromptFormData>;
  error?: string;
}

export function KeywordInput({ keywords, setValue, error }: KeywordInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddKeyword = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      setValue('keywords', [...keywords, trimmedValue], { shouldValidate: true });
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setValue(
      'keywords',
      keywords.filter((k) => k !== keyword),
      { shouldValidate: true }
    );
  };

  return (
    <div className="mb-6">
      <FormLabel className="text-sm font-medium">SEO Keywords</FormLabel>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-sm px-2 py-1">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Add keywords..."
                className="flex-grow"
              />
              <Button type="button" onClick={handleAddKeyword} variant="secondary" size="sm">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
