import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { PromptFormData } from '@/types/ghost-writer';

interface TitleInputProps {
  form: UseFormReturn<PromptFormData>;
}

export function TitleInput({ form }: TitleInputProps) {
  return (
    <FormField
      control={form.control}
      name="prompt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subject</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter your title or subject here..."
              className="w-full p-4 text-lg"
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
