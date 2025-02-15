import { JSDOM } from 'jsdom';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateHtmlOutput(content: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [] };

  try {
    // Check for well-formed HTML first
    const openTags = content.match(/<[^/][^>]*>/g) || [];
    const closeTags = content.match(/<\/[^>]+>/g) || [];

    // Simple tag matching check
    if (openTags.length - closeTags.length !== 0) {
      result.errors.push('Malformed HTML: unclosed tags detected');
      result.isValid = false;
      return result;
    }

    const dom = new JSDOM(content);
    const doc = dom.window.document;

    // Check if content is parseable HTML
    if (!doc.body) {
      result.errors.push('Invalid HTML structure');
      result.isValid = false;
    }

    // Check for empty content
    if (!content.trim()) {
      result.errors.push('Content is empty');
      result.isValid = false;
    }

    // Check for basic HTML structure
    const hasArticle = doc.querySelector('article');
    if (!hasArticle) {
      result.errors.push('Missing article tag');
      result.isValid = false;
    }

    // Check for heading
    const hasHeading = doc.querySelector('h1, h2');
    if (!hasHeading) {
      result.errors.push('Missing main heading');
      result.isValid = false;
    }

    // Check for any parsing warnings
    const serialized = dom.serialize();
    if (serialized.includes('&lt;') || serialized.includes('&gt;')) {
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
