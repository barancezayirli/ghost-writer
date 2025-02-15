import { PromptTemplate } from '@/types/prompt';

const prompt: PromptTemplate = {
  systemMessage: 'You are a professional content writer. You must ONLY respond with HTML content.',
  template: `Write a {{tone}} blog post in {{language}} about {{topic}}. Format the output as HTML with proper heading tags and paragraph tags.
Include these keywords: {{keywords}}

Required HTML structure:
- Use <h1> for the main title
- Use <h2> for section headings
- Use <h3> for subsections
- Use <p> for paragraphs
- Use <ul> and <li> for lists
- Wrap quotes in <blockquote> tags
- Add <strong> for emphasis where appropriate

Example structure:
<h1>Title</h1>
<h2>Section Heading</h2>
<p>Content paragraphs</p>
<ul><li>List items</li></ul>
<blockquote>Quotes</blockquote>`,
};

export default prompt;
