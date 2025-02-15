'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PromptForm } from './prompt-form';
import { GeneratedContent } from './generated-content';
import { generate } from '@/actions/generate';
import type { PromptFormData } from '@/types/ghost-writer';
import { stripHtml } from '@/lib/utils';
import { useCopyToClipboard } from 'usehooks-ts';

export default function GhostWriter() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState<PromptFormData | null>(null);
  const [, copy] = useCopyToClipboard();

  const handleGenerate = async (data: PromptFormData) => {
    setIsGenerating(true);
    setPrompt(data);
    try {
      const response = await generate({
        promptName: 'blog-post',
        promptVersion: 'v3', // Using v1 as default
        variables: {
          topic: data.subject,
          keywords: data.keywords.join(', '),
          tone: data.tone,
          mode: data.mode,
          language: data.language,
        },
      });
      setGeneratedContent(response.content);
      setRequestId(response.requestId);
      console.log('Request id:', response.requestId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (userPrompt: string) => {
    if (prompt && generatedContent) {
      try {
        setIsGenerating(true);
        const response = await generate({
          promptName: 'improve',
          promptVersion: 'v1', // Using v1 as default
          variables: {
            topic: prompt.subject,
            keywords: prompt.keywords.join(', '),
            tone: prompt.tone,
            mode: prompt.mode,
            language: prompt.language,
            content: generatedContent,
            userPrompt,
          },
        });
        setGeneratedContent(response.content);
        setRequestId(response.requestId);
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
    } else {
      // There maybe an error just reset the UI
      setPrompt(null);
      setGeneratedContent(null);
      setRequestId(null);
    }
  };

  const handleRetry = () => (prompt ? handleGenerate(prompt) : undefined);
  const handleLike = () => toast({ title: 'Liked!', description: 'Thank you for your feedback.' });
  const handleDislike = () => toast({ title: 'Disliked', description: "We'll try to improve." });

  const handleCopy = async () => {
    const textToCopy = stripHtml(generatedContent || '');
    await copy(textToCopy);
    toast({ title: 'Copied!', description: 'Content copied to clipboard.' });
  };

  const handleClear = () => {
    setPrompt(null);
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
          onUpdate={async (prompt: string) => {
            if (prompt) {
              await handleImprove(prompt);
            }
          }}
          isGenerating={isGenerating}
          requestId={requestId}
        />
      ) : (
        <PromptForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
      )}
    </div>
  );
}
