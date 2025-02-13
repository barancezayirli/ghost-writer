'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { TitleInput } from './title-input';
import { KeywordManager } from './keyword-manager';
import { ContentSettings } from './content-settings';
import { GeneratedContent } from './generated-content';
import { ContentSettings as Settings } from '@/types/ghost-writer';

export default function GhostWriter() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    language: 'en',
    tone: 'formal',
    mode: 'fast',
    target: 'blog',
  });

  const handleAddKeyword = (keyword: string) => {
    setKeywords([...keywords, keyword]);
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const generateArticle = async () => {
    setIsGenerating(true);
    try {
      // Implement your API call here
      const placeholderContent = `
        <h1>${title}</h1>
        <p>Generated content with keywords: ${keywords.join(', ')}</p>
      `;
      setGeneratedContent(placeholderContent);
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

  const handleRetry = () => generateArticle();
  const handleLike = () => toast({ title: 'Liked!', description: 'Thank you for your feedback.' });
  const handleDislike = () => toast({ title: 'Disliked', description: "We'll try to improve." });
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent || '');
    toast({ title: 'Copied!', description: 'Content copied to clipboard.' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Ghost Writer</h1>
      </header>

      <TitleInput value={title} onChange={setTitle} />
      <KeywordManager
        keywords={keywords}
        onAddKeyword={handleAddKeyword}
        onRemoveKeyword={handleRemoveKeyword}
      />
      <ContentSettings
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onGenerate={generateArticle}
        isGenerating={isGenerating}
      />

      {generatedContent && (
        <GeneratedContent
          content={generatedContent}
          onRetry={handleRetry}
          onLike={handleLike}
          onDislike={handleDislike}
          onCopy={handleCopy}
          onUpdate={(update) => {
            // Implement update logic
            console.log('Updating content with:', update);
          }}
        />
      )}
    </div>
  );
}
