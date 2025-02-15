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

export interface PromptFormData {
  subject: string;
  keywords: string[];
  language: Language;
  tone: Tone;
  mode: Mode;
  target: Target;
}
