'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PromptForm } from './prompt-form';
import { GeneratedContent } from './generated-content';
import { generate } from '@/actions/generate';
import type { PromptFormData } from '@/types/ghost-writer';

export default function GhostWriter() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (data: PromptFormData) => {
    setIsGenerating(true);
    try {
      const response = await generate({
        promptName: 'blog-post',
        promptVersion: 'v2', // Using v1 as default
        variables: {
          topic: data.subject,
          keywords: data.keywords.join(', '),
          tone: data.tone,
          mode: data.mode,
          language: data.language,
        },
      });
      console.log('response:', response);

      setGeneratedContent(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to generate content: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => handleGenerate;
  const handleLike = () => toast({ title: 'Liked!', description: 'Thank you for your feedback.' });
  const handleDislike = () => toast({ title: 'Disliked', description: "We'll try to improve." });
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent || '');
    toast({ title: 'Copied!', description: 'Content copied to clipboard.' });
  };

  const handleClear = () => {
    setGeneratedContent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Ghost Writer</h1>
      </header>

      {generatedContent ? (
        <GeneratedContent
          content={generatedContent}
          onRetry={handleRetry}
          onLike={handleLike}
          onDislike={handleDislike}
          onCopy={handleCopy}
          onClear={handleClear}
          onUpdate={(update) => {
            // Implement update logic
            console.log('Updating content with:', update);
          }}
        />
      ) : (
        <PromptForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
      )}
    </div>
  );
}
