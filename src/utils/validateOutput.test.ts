import { validateHtmlOutput } from './validateOutput';

describe('validateHtmlOutput', () => {
  test('validates correct HTML structure', () => {
    const validHtml = `
      <article>
        <h1>Test Title</h1>
        <p>Test content</p>
      </article>
    `;
    const result = validateHtmlOutput(validHtml);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('detects missing article tag', () => {
    const invalidHtml = `
      <div>
        <h1>Test Title</h1>
        <p>Test content</p>
      </div>
    `;
    const result = validateHtmlOutput(invalidHtml);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing article tag');
  });

  test('detects missing heading', () => {
    const invalidHtml = `
      <article>
        <p>Test content without heading</p>
      </article>
    `;
    const result = validateHtmlOutput(invalidHtml);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing main heading');
  });

  test('handles empty content', () => {
    const result = validateHtmlOutput('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Content is empty');
  });

  test('handles malformed HTML', () => {
    const invalidHtml = '<article><h1>Unclosed Tags';
    const result = validateHtmlOutput(invalidHtml);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Missing main heading');
  });
});
