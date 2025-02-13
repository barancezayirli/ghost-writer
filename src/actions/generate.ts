'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { Language, Tone, Mode, Target } from '@/types/ghost-writer';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

type GenerateParams = {
  promptName: string;
  promptVersion: string;
  variables: {
    topic: string;
    keywords: string;
    language: Language;
    tone: Tone;
    mode: Mode;
    target: Target;
  };
};

export async function generate({ promptName, promptVersion, variables }: GenerateParams) {
  try {
    const promptPath = path.join(
      process.cwd(),
      'src',
      'prompts',
      promptName,
      `${promptVersion}.txt`
    );
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');

    // Replace variables in prompt template
    const filledPrompt = Object.entries(variables).reduce(
      (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
      promptTemplate
    );

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent([
      { text: 'You are a professional content writer. Always respond with valid HTML content.' },
      { text: filledPrompt },
    ]);

    const response = await result.response;
    const htmlContent = response.text();

    // Basic validation to ensure content is wrapped in HTML
    if (!htmlContent.includes('<')) {
      return `<p>${htmlContent}</p>`;
    }

    return htmlContent;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}
