import { PromptTemplate } from '@/types/prompt';
import v1 from './v1';
import v2 from './v2';
import v3 from './v3';

export const prompts: Record<string, PromptTemplate> = {
  v1,
  v2,
  v3,
};

export type BlogPostVersion = keyof typeof prompts;
