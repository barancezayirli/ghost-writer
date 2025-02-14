'use server';

import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';
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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([
      {
        text: `You are a professional content writer. You must ONLY respond with Markdown content.
Never include HTML tags. Use proper Markdown syntax for headings (#), lists (- or 1.), emphasis (*), 
links ([]()), and other formatting. Your entire response must be valid Markdown.`,
      },
      { text: filledPrompt },
    ]);

    const response = await result.response;
    let content = response.text();

    // Validate that the response is a Markdown code block
    if (!content.startsWith('```markdown')) {
      throw new Error('Response is not in the expected Markdown format');
    }

    // Remove ```markdown from the beginning and ``` from the end
    content = content
      .replace(/^```markdown\n/, '') // Remove opening ```markdown
      .replace(/\n```$/, ''); // Remove closing ```

    // Validate that the content is not HTML
    if (content.includes('<') && content.includes('>')) {
      throw new Error('Received HTML instead of Markdown');
    }

    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof GoogleGenerativeAIFetchError) {
      throw new Error(error.statusText ?? `Error generating post`);
    }
    throw 'Error generating content';
  }
}
