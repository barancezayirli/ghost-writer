'use server';

import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  RequestOptions,
} from '@google/generative-ai';
import { Language, Tone, Mode } from '@/types/ghost-writer';
import { PromptName, PromptVersion, getPrompt } from '@/prompts';
import { validateHtmlOutput } from '@/utils/validateOutput';

type GenerateParams = {
  promptName: PromptName;
  promptVersion: PromptVersion<PromptName>;
  variables: {
    topic: string;
    keywords: string;
    language: Language;
    tone: Tone;
    mode: Mode;
    content?: string; // Optional content for improve prompt
    userPrompt?: string; // The user's improvement request
  };
};

function getGeminiModel(mode: Mode) {
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
      model: mode === 'fast' ? 'gemini-2.0-flash' : 'gemini-pro',
    },
    requestOptions
  );

  return model;
}

function getPromptContent(
  promptName: PromptName,
  promptVersion: PromptVersion<PromptName>,
  variables: Record<string, string>
) {
  const prompt = getPrompt(promptName, promptVersion);
  const filledTemplate = Object.entries(variables).reduce(
    (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
    prompt.template
  );

  return { filledTemplate, systemMessage: prompt.systemMessage };
}

async function callGemini(prompt: string, systemMessage: string, mode: Mode) {
  const maxAttempts = 3;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    const model = getGeminiModel(mode);
    const result = await model.generateContent([{ text: systemMessage }, { text: prompt }]);

    const response = result.response;
    const content = response.text();

    if (!content.startsWith('```html')) {
      throw new Error('Response is not in the expected HTML format');
    }

    const htmlContent = content
      .replace(/^```html\n/, '')
      .replace(/\n```$/, '')
      .trim();

    const validation = validateHtmlOutput(htmlContent);
    if (validation.isValid) {
      return htmlContent;
    }

    if (attempt === maxAttempts) {
      break;
    }

    console.warn(`Attempt ${attempt}/${maxAttempts} failed validation. Retrying...`);
    attempt++;
  }

  throw new Error(`Failed to generate valid HTML after ${maxAttempts} attempts`);
}

export async function generate({ promptName, promptVersion, variables }: GenerateParams) {
  try {
    const { filledTemplate, systemMessage } = await getPromptContent(
      promptName,
      promptVersion,
      variables
    );
    return await callGemini(filledTemplate, systemMessage, variables.mode);
  } catch (error) {
    if (error instanceof GoogleGenerativeAIFetchError) {
      throw new Error(error.statusText ?? 'Error generating post');
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error');
  }
}
