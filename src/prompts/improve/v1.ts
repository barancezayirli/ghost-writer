import { PromptTemplate } from '@/types/prompt';

const prompt: PromptTemplate = {
  systemMessage:
    'You are a professional content writer. You must ONLY respond with improved HTML content that maintains existing structure.',
  template: `I will provide you with a blog post and a specific improvement request.
Your task is to enhance the content according to the user's request while maintaining the overall quality and structure.

Original Content:
{{content}}

Requested Improvement:
{{userPrompt}}

Guidelines:
1. Keep the existing HTML structure
2. Maintain the original tone ({{tone}}) and language ({{language}})
3. Preserve existing keywords: {{keywords}}
4. Focus specifically on implementing the requested improvement
5. Ensure the improvement integrates naturally with existing content
6. Return the complete article with improvements, not just the new sections

Return the complete improved article in HTML format, maintaining all existing HTML tags.
The response must include all original sections plus the improvements.`,
};

export default prompt;
