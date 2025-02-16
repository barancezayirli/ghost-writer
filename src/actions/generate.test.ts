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
    it('should generate valid HTML content with UUID request ID', async () => {
      mockGenerateContent.mockResolvedValueOnce(mockValidResponse);

      const result = await generate(defaultParams);

      expect(result).toHaveProperty('content', validHtmlResponse);
      expect(result).toHaveProperty('requestId');
      expect(result.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });
  });

  // Validation cases
  describe('validation handling', () => {
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
      expect(result).toHaveProperty('content', validHtmlResponse);
      expect(result).toHaveProperty('requestId');
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      expect(validateHtmlOutput).toHaveBeenCalledTimes(3);
    });

    it('should retry and succeed on second attempt', async () => {
      (validateHtmlOutput as jest.Mock)
        .mockReturnValueOnce({ isValid: false, errors: ['First try failed'] })
        .mockReturnValueOnce({ isValid: true });

      mockGenerateContent.mockResolvedValue(mockValidResponse);

      const result = await generate(defaultParams);
      expect(result).toHaveProperty('content', validHtmlResponse);
      expect(result).toHaveProperty('requestId');
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

  // Update error handling tests
  describe('error handling', () => {
    it('should propagate rate limit error (429)', async () => {
      const rateLimitError = new GoogleGenerativeAIFetchError(
        'Rate limit exceeded',
        429,
        'Too Many Requests'
      );
      rateLimitError.status = 429;
      mockGenerateContent.mockRejectedValueOnce(rateLimitError);

      await expect(generate(defaultParams)).rejects.toThrow('limit exceeded');
    });

    it('should handle API errors with status', async () => {
      const apiError = new GoogleGenerativeAIFetchError('API Error', 500, 'Internal Server Error');
      apiError.status = 500;
      apiError.statusText = 'Internal Server Error';
      mockGenerateContent.mockRejectedValueOnce(apiError);

      await expect(generate(defaultParams)).rejects.toThrow('Internal Server Error');
    });

    it('should handle API errors without status', async () => {
      const apiError = new GoogleGenerativeAIFetchError('API Error', undefined, undefined);
      mockGenerateContent.mockRejectedValueOnce(apiError);

      await expect(generate(defaultParams)).rejects.toThrow('Error generating post');
    });

    it('should propagate validation errors directly', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('Validation failed'));

      await expect(generate(defaultParams)).rejects.toThrow('Validation failed');
    });
  });
});
