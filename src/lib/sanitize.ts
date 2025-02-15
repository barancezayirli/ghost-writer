import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  // Configure DOMPurify to allow specific tags and attributes needed for blog posts
  const config = {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'a',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  };

  return DOMPurify.sanitize(html, config);
}
