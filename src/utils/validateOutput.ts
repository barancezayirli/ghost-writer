import { parse } from 'node-html-parser';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateHtmlOutput(content: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [] };

  try {
    // Check for empty content
    if (!content.trim()) {
      result.errors.push('Content is empty');
      result.isValid = false;
      return result;
    }

    // Parse HTML content
    const root = parse(content);

    // Check for basic HTML structure
    const hasArticle = root.querySelector('article');
    if (!hasArticle) {
      result.errors.push('Missing article tag');
      result.isValid = false;
    }

    // Check for heading
    const hasHeading = root.querySelector('h1, h2');
    if (!hasHeading) {
      result.errors.push('Missing main heading');
      result.isValid = false;
    }

    // Check for malformed HTML
    const htmlString = root.toString();
    if (htmlString.includes('&lt;') || htmlString.includes('&gt;')) {
      result.errors.push('Malformed HTML: contains encoded HTML tags');
      result.isValid = false;
    }
  } catch (error) {
    result.errors.push(
      `HTML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    result.isValid = false;
  }

  return result;
}
