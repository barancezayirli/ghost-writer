import { prompts as blogPostPrompts, BlogPostVersion } from './blog-post';
import { prompts as improvePrompts, ImproveVersion } from './improve';

export const prompts = {
  'blog-post': blogPostPrompts,
  improve: improvePrompts,
} as const;

export type PromptName = keyof typeof prompts;
export type PromptVersion<T extends PromptName> = T extends 'blog-post'
  ? BlogPostVersion
  : T extends 'improve'
    ? ImproveVersion
    : never;

export function getPrompt<T extends PromptName>(name: T, version: PromptVersion<T>) {
  const promptSet = prompts[name];
  const prompt = promptSet[version as keyof typeof promptSet];
  if (!prompt) {
    throw new Error(`Prompt ${name}/${version} not found`);
  }
  return prompt;
}
