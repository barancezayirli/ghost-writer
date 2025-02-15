import { PromptTemplate } from '@/types/prompt';
import v1 from './v1';

export const prompts: Record<string, PromptTemplate> = {
  v1,
};

export type ImproveVersion = keyof typeof prompts;
