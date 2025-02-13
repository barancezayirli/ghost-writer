export interface GenerateFormData {
  promptName: string;
  promptVersion: string;
  topic: string;
  tone: string;
  length: string;
  audience: string;
}

export interface PromptVersion {
  version: string;
  description: string;
}

export interface PromptMetadata {
  name: string;
  versions: PromptVersion[];
}
