'use server';

import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  RequestOptions,
} from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { Language, Tone, Mode, Target } from '@/types/ghost-writer';

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

function getGeminiModel() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key is not set in the environment variables');
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  let requestOptions: RequestOptions | undefined;
  if (process.env.HELICONE_API_KEY) {
    const customHeaders = new Headers({
      'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
      'Helicone-Target-URL': `https://generativelanguage.googleapis.com`,
    });

    requestOptions = {
      customHeaders: customHeaders,
      baseUrl: 'https://gateway.helicone.ai',
    } as RequestOptions;
  }

  const model = genAI.getGenerativeModel(
    {
      model: 'gemini-2.0-flash',
    },
    requestOptions
  );

  return model;
}

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

    const model = getGeminiModel();
    const result = await model.generateContent([
      {
        text: `You are a professional content writer. You must ONLY respond with Markdown content.
Never include HTML tags. Use proper Markdown syntax for headings (#), lists (- or 1.), emphasis (*), 
links ([]()), and other formatting. Your entire response must be valid Markdown.`,
      },
      { text: filledPrompt },
    ]);

    const response = result.response;
    let content = response.text();
    console.log('content:', content);

    // Validate that the response is a Markdown code block
    if (!content.startsWith('```markdown')) {
      throw new Error('Response is not in the expected Markdown format');
    }

    // Remove ```markdown from the beginning and ``` from the end
    content = content
      .replace(/^```markdown\n/, '') // Remove opening ```markdown
      .replace(/\n```$/, ''); // Remove closing ```

    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof GoogleGenerativeAIFetchError) {
      throw new Error(error.statusText ?? `Error generating post`);
    }
    throw 'Error generating content';
  }
}
