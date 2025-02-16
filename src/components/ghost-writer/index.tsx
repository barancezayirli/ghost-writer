'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { generate } from '@/actions/generate';
import { feedback } from '@/actions/feedback';
import { PromptForm } from './prompt-form';
import { GeneratedContent } from './generated-content';
import type { PromptFormData } from '@/types/ghost-writer';
import { stripHtml } from '@/lib/utils';
import { useCopyToClipboard } from 'usehooks-ts';

export default function GhostWriter() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState<PromptFormData | null>(null);
  const [, copy] = useCopyToClipboard();

  const handleGenerate = async (data: PromptFormData, isRetry = false) => {
    setIsGenerating(true);
    setPrompt(data);
    const oldRequestId = requestId;
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
    if (isRetry && oldRequestId) {
      try {
        await feedback({ requestId: oldRequestId, result: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        //This is for logging on cloud but there is no need for that for the tool
        console.error(`Failed to send feedback: ${errorMessage}`);
      }
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

  const handleRetry = () => (prompt ? handleGenerate(prompt, true) : undefined);

  const handleFeedback = async (isPositive: boolean) => {
    if (!requestId) return;
    try {
      const response = await feedback({ requestId, result: isPositive });
      // should check here if response is success but only self host helicone supports custom values
      if (response) {
        toast({
          title: isPositive ? 'Liked!' : 'Disliked',
          description: isPositive ? 'Thank you for your feedback.' : "We'll try to improve.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send feedback';
      toast({
        title: 'Error',
        // This is because vercel doesn't want to show the error message
        description:
          errorMessage === 'limit exceeded'
            ? "Fee gemini key has it's own limits :)"
            : `Error: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };

  const handleLike = () => handleFeedback(true);
  const handleDislike = () => handleFeedback(false);

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
        />
      ) : (
        <PromptForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
      )}
    </div>
  );
}
