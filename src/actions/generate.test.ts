import { generate } from './generate';
import { validateHtmlOutput } from '@/utils/validateOutput';
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';
import { Language, Tone, Mode } from '@/types/ghost-writer';
import { PromptName } from '@/prompts';

// Mock dependencies
jest.mock('@google/generative-ai');
jest.mock('@/utils/validateOutput');
jest.mock('@/prompts', () => ({
  getPrompt: () => ({
    template: 'Test template {{topic}}',
    systemMessage: 'Test system message',
  }),
}));

describe('generate', () => {
  const mockGenerateContent = jest.fn();
  const originalEnv = process.env;

  // Test data
  const defaultParams = {
    promptName: 'create' as PromptName,
    promptVersion: 'v1',
    variables: {
      topic: 'Test Topic',
      keywords: 'test, keywords',
      language: 'en' as Language,
      tone: 'professional' as Tone,
      mode: 'fast' as Mode,
      content: undefined,
      userPrompt: undefined,
    },
  };

  const validHtmlResponse = '<div>Test content</div>';
  const mockValidResponse = {
    response: { text: () => '```html\n' + validHtmlResponse + '\n```' },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, GOOGLE_API_KEY: 'test-api-key' };

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: mockGenerateContent,
      }),
    }));

    (validateHtmlOutput as jest.Mock).mockReturnValue({ isValid: true });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // Success cases
  describe('successful generation', () => {
    it('should generate valid HTML content', async () => {
      mockGenerateContent.mockResolvedValueOnce(mockValidResponse);

      const result = await generate(defaultParams);

      expect(result).toBe(validHtmlResponse);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });
  });

  // Validation cases
  describe('validation handling', () => {
    it('should reject non-HTML formatted responses', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        response: { text: () => 'Invalid response without HTML code block' },
      });

      await expect(generate(defaultParams)).rejects.toThrow(
        'Response is not in the expected HTML format'
      );
    });

    it('should reject invalid HTML content after 3 attempts', async () => {
      (validateHtmlOutput as jest.Mock).mockReturnValue({
        isValid: false,
        errors: ['Invalid structure'],
      });

      mockGenerateContent.mockResolvedValue(mockValidResponse);

      await expect(generate(defaultParams)).rejects.toThrow(
        'Failed to generate valid HTML after 3 attempts'
      );
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      expect(validateHtmlOutput).toHaveBeenCalledTimes(3);
    });
  });

  // Retry behavior
  describe('retry behavior', () => {
    it('should retry and succeed on third attempt', async () => {
      (validateHtmlOutput as jest.Mock)
        .mockReturnValueOnce({ isValid: false, errors: ['First try failed'] })
        .mockReturnValueOnce({ isValid: false, errors: ['Second try failed'] })
        .mockReturnValueOnce({ isValid: true });

      mockGenerateContent.mockResolvedValue(mockValidResponse);

      const result = await generate(defaultParams);
      expect(result).toBe(validHtmlResponse);
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      expect(validateHtmlOutput).toHaveBeenCalledTimes(3);
    });

    it('should retry and succeed on second attempt', async () => {
      (validateHtmlOutput as jest.Mock)
        .mockReturnValueOnce({ isValid: false, errors: ['First try failed'] })
        .mockReturnValueOnce({ isValid: true });

      mockGenerateContent.mockResolvedValue(mockValidResponse);

      const result = await generate(defaultParams);
      expect(result).toBe(validHtmlResponse);
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(validateHtmlOutput).toHaveBeenCalledTimes(2);
    });

    it('should not retry and throw error after third attempt', async () => {
      (validateHtmlOutput as jest.Mock)
        .mockReturnValueOnce({ isValid: false, errors: ['First try failed'] })
        .mockReturnValueOnce({ isValid: false, errors: ['Second try failed'] })
        .mockReturnValueOnce({ isValid: false, errors: ['Third try failed'] });

      mockGenerateContent.mockResolvedValue(mockValidResponse);

      await expect(generate(defaultParams)).rejects.toThrow(
        'Failed to generate valid HTML after 3 attempts'
      );
    });
  });

  // Error cases
  describe('error handling', () => {
    it('should handle missing API key', async () => {
      delete process.env.GOOGLE_API_KEY;

      await expect(generate(defaultParams)).rejects.toThrow(
        'Google API key is not set in the environment variables'
      );
    });

    it('should handle API errors', async () => {
      const apiError = new GoogleGenerativeAIFetchError('API Error', 500, 'Server Error');
      apiError.statusText = 'Server Error';
      mockGenerateContent.mockRejectedValueOnce(apiError);

      await expect(generate(defaultParams)).rejects.toThrow('Server Error');
    });

    it('should handle general errors', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(generate(defaultParams)).rejects.toThrow('Unexpected error');
    });
  });
});
