import { PromptTemplate } from '@/types/prompt';

const prompt: PromptTemplate = {
  systemMessage: 'You are a professional content writer. You must ONLY respond with HTML content.',
  template: `Create an engaging blog post about {{topic}} following these guidelines:

1. **Content Generation:**
    * Produce a complete blog post directly within the HTML structure below.
    * Output *only* the HTML content, without any additional text or formatting.
    * Focus on delivering comprehensive and engaging content under each section.
    * Maintain a {{tone}} tone of voice and use {{language}}.
    * Integrate the following keywords naturally: {{keywords}}.
    * Use clear subheadings to improve readability.
    * Support your points with relevant examples and evidence.
    * Use lists for organized presentation of data or key points.
    * Employ transition words for a smooth flow between sections.
    * **When including links, use descriptive and relevant link text instead of raw URLs.**
    * **Prioritize links to well-established and authoritative websites, such as government agencies, reputable organizations, and recognized publications.**
    * **When possible, link to resources with stable URLs and a history of consistent availability.**
    * **Ensure that each link is directly relevant to the surrounding content and provides valuable supplemental information.**

2. **Title Creation:**
    * Generate a concise and compelling title, no more than 60 characters.
    * Optimize the title for a {{target audience}} audience.
    * Use strong power words and relevant keywords.

3. **Introduction Writing:**
    * Begin with a captivating hook: a statistic, question, story, or surprising fact.
    * Address the reader's primary pain point or interest.
    * Provide a clear preview of the post's content.
    * Limit the introduction to 2-3 concise paragraphs.

4. **Conclusion Writing:**
    * **Include a subheading within the conclusion section, titled "Key Takeaways" or a similar relevant heading.**
    * **Create a bulleted list of the main key takeaways immediately after the heading.**
    * Summarize the main points and key takeaways.
    * Include a specific call to action (e.g., "Leave a comment," "Share this article," "Subscribe").
    * End with a memorable final thought or reflection.
    * Include links to relevant resources when appropriate.
    * **Include links to relevant resources with descriptive link text, using HTML <a> tags (e.g., <a href="URL">Link Text</a>).**



Required HTML Structure:
<article>
  <h1>Title</h1>
  <p class="introduction">Introduction</p>
  <h2>Main Sections</h2>
  <p>Content</p>
  <h3>Sub-sections</h3>
  <ul><li>Key points</li></ul>
  <ol>List example</ol>
  <h2 class="conclusion-heading">Key Takeaways</h2>
  <ul class="key-takeaways">
    <li>Key takeaway 1</li>
    <li>Key takeaway 2</li>
    <li>Key takeaway 3</li>
  </ul>
  <p class="conclusion">Conclusion</p>
</article>`,
};

export default prompt;
