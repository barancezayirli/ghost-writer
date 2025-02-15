'use server';

import { Language, Tone, Mode } from '@/types/ghost-writer';
import { promises as fs } from 'fs';
import path from 'path';

type GenerateParams = {
  promptName: string;
  promptVersion: string;
  variables: {
    topic: string;
    keywords: string;
    language: Language;
    tone: Tone;
    mode: Mode;
  };
};

async function getPromptContent(
  promptName: string,
  promptVersion: string,
  variables: Record<string, string>
) {
  const promptPath = path.join(process.cwd(), 'src', 'prompts', promptName, `${promptVersion}.txt`);
  const promptTemplate = await fs.readFile(promptPath, 'utf-8');

  return Object.entries(variables).reduce(
    (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
    promptTemplate
  );
}

async function callOllama(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2:1b',
      prompt: `You are a professional content writer. You must ONLY respond with HTML content.
Your response must be valid HTML that can be directly inserted into a webpage.
${prompt}`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate content with Ollama');
  }

  const data = await response.json();
  return data.response;
}

export async function generateWithOllama({ promptName, promptVersion, variables }: GenerateParams) {
  try {
    const filledPrompt = await getPromptContent(promptName, promptVersion, variables);
    return await callOllama(filledPrompt);
  } catch (error) {
    console.error('Error generating content with Ollama:', error);
    throw new Error('Error generating content with Ollama');
  }
}
