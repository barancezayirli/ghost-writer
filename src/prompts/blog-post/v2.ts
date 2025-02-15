import { PromptTemplate } from '@/types/prompt';

const prompt: PromptTemplate = {
  systemMessage: 'You are a professional content writer. You must ONLY respond with HTML content.',
  template: `Create an engaging blog post about {{topic}} following these guidelines:

1. Start with an outline:
- Create a logical flow of main points and subpoints
- Identify 3-4 key sections to cover
- Plan supporting examples or data points

2. Craft a compelling title:
- Make it clear and specific
- Include target keywords when relevant
- Keep it under 60 characters
- Use power words to attract attention

3. Write an engaging introduction:
- Start with a hook (question, statistic, or story)
- Identify the reader's pain point or interest
- Preview what the post will cover
- Keep it concise (2-3 paragraphs)

4. Develop the main content:
- Writing style: {{tone}}
- Language: {{language}}
- Keywords to include: {{keywords}}
- Use subheadings for easy scanning
- Include relevant examples and evidence
- Keep paragraphs short (3-4 sentences)
- Use transition words between sections

5. Conclude with impact:
- Summarize key takeaways
- Include a clear call-to-action
- Encourage reader engagement
- Link to relevant resources when appropriate

Required HTML Structure:
<article>
  <h1>Title</h1>
  <p class="introduction">Introduction</p>
  <h2>Main Sections</h2>
  <p>Content</p>
  <h3>Sub-sections</h3>
  <ul><li>Key points</li></ul>
  <blockquote>Important quotes</blockquote>
  <p class="conclusion">Conclusion</p>
</article>`,
};

export default prompt;
