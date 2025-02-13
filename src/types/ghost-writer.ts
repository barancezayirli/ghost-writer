export type Language = 'en' | 'es' | 'fr' | 'de';
export type Tone = 'formal' | 'casual' | 'humorous' | 'serious';
export type Mode = 'slow' | 'fast';
export type Target = 'blog' | 'x' | 'linkedin';

export interface ContentSettings {
  language: Language;
  tone: Tone;
  mode: Mode;
  target: Target;
}

export interface PromptFormData extends ContentSettings {
  prompt: string;
  keywords: string[];
}

// Remove DEFAULT_SETTINGS constant as we're using inline defaults in the form
