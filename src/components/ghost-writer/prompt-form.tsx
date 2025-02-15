'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/components/form/select-field';
import { LANGUAGE_OPTIONS, TONE_OPTIONS, MODE_OPTIONS } from '@/components/form/form-options';
import { KeywordInput } from '@/components/form/keyword-input';

const promptFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  keywords: z.array(z.string()),
  language: z.enum(['en', 'es', 'fr', 'de']),
  tone: z.enum(['formal', 'casual', 'humorous', 'serious']),
  mode: z.enum(['fast', 'slow']),
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
      mode: 'fast',
      target: 'blog',
    },
  });

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
        <KeywordInput
          keywords={form.getValues('keywords')}
          setValue={form.setValue}
          error={form.formState.errors.keywords?.message}
        />

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
