export interface PromptVersion {
  version: string;
  description: string;
}

export interface PromptMetadata {
  name: string;
  versions: PromptVersion[];
}
