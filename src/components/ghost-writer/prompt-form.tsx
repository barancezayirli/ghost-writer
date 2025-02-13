'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PromptFormData } from '@/types/ghost-writer';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectField } from '@/components/form/select-field';
import {
  LANGUAGE_OPTIONS,
  TONE_OPTIONS,
  MODE_OPTIONS,
  TARGET_OPTIONS,
} from '@/components/form/form-options';

const promptFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  keywords: z.array(z.string()),
  language: z.enum(['en', 'es', 'fr', 'de']),
  tone: z.enum(['formal', 'casual', 'humorous', 'serious']),
  mode: z.enum(['fast', 'slow']),
  target: z.enum(['blog', 'x', 'linkedin']),
});

interface PromptFormProps {
  onSubmit: (data: PromptFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function PromptForm({ onSubmit, isSubmitting = false }: PromptFormProps) {
  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      subject: '',
      keywords: [],
      language: 'en',
      tone: 'formal',
      mode: 'slow',
      target: 'blog',
    },
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const keywords = form.watch('keywords');

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      form.setValue('keywords', [...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    form.setValue(
      'keywords',
      keywords.filter((k) => k !== keyword)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Input */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="text-sm font-medium">Subject</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your title or subject here..."
                  className="w-full p-4 text-lg border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Keywords Manager */}
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
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
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
          {form.formState.errors.keywords && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.keywords.message}
            </p>
          )}
        </div>

        {/* Content Settings */}
        <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
          <div className="w-full sm:flex-grow grid grid-cols-2 sm:grid-cols-4 gap-2">
            <SelectField
              form={form}
              name="language"
              label="Language"
              placeholder="Select language"
              options={LANGUAGE_OPTIONS}
            />
            <SelectField
              form={form}
              name="tone"
              label="Tone"
              placeholder="Select tone"
              options={TONE_OPTIONS}
            />
            <SelectField
              form={form}
              name="mode"
              label="Mode"
              placeholder="Select mode"
              options={MODE_OPTIONS}
            />
            <SelectField
              form={form}
              name="target"
              label="Target"
              placeholder="Select target"
              options={TARGET_OPTIONS}
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto px-6" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
