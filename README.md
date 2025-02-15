# Ghost Writer

Ghost Writer is a Next.js application that leverages Google's Gemini AI to generate high-quality blog posts. Simply input your topic and preferences, and let Ghost Writer create engaging content for your blog.

If you find this project useful, please consider giving it a ⭐️ on GitHub!

## Live Demo

A demo version is available online, but it uses free API keys with limited quota. For the best experience, I recommend cloning the repository and running it locally with your own API keys.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Google Gemini** - AI model for content generation
- **Helicone** - LLM logging and monitoring
- **Tailwind CSS** - Styling and UI components
- **TypeScript** - Type safety and better developer experience

## Development Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/ghost-writer.git
cd ghost-writer
```

Install dependencies:

```bash
pnpm install
```

Set up environment variables:

```bash
cp .example.env .env.local
```

Update the `.env.local` file with your API keys:

- Get your Google API key from the Google Cloud Console
- (Optional) Get your Helicone API key for LLM logging

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Design Overview

Ghost Writer is intentionally designed to be lightweight and focused. The architecture emphasizes simplicity and maintainability:

- Minimalist state management without complex stores
- Straightforward testing strategy
- Version-controlled prompt templates for consistent output
- No database dependency, keeping the app portable and easy to deploy

The goal is to do one thing well: generate quality blog posts with AI assistance.

LLM outputs are inherently unpredictable. While providing AI-specific guidelines helps, it doesn't guarantee consistent responses. To address this, I structured the outputs as HTML and implemented validation checks to ensure proper structure. This approach has helped me mitigate consistency issues. I also added unit tests to provide additional confidence in the tool's reliability.

To enhance user experience, I implemented a retry mechanism for failed LLM calls. Instead of immediately failing when the output structure isn't correct, the system makes up to three attempts to generate valid content. With an average input size of 210 tokens, this retry approach provides a good balance between reliability and cost-effectiveness.

## Prompt Engineering

My journey with prompt engineering has been quite interesting. I started by experimenting with local LLMs through Ollama, which gave me the freedom to test and iterate quickly without worrying about API costs. Once I had a solid foundation, I moved to Gemini and began fine-tuning my prompts for its specific characteristics.

Helicone has been instrumental in this process, giving me insights into every interaction - from raw inputs and outputs to associated costs. While Gemini generally produces great content, I discovered various edge cases during testing: sometimes sections would be too short, structural elements would be misplaced, or the flow wouldn't feel quite right. Having access to these detailed logs helped me systematically improve the prompts until I achieved consistently high-quality outputs.

The result is a set of carefully crafted prompt templates that reliably generate well-structured, engaging blog posts while maintaining the natural flow of human-written content.

Generating content that balances SEO requirements with engaging readability is challenging. I approached this by implementing detailed prompt templates based on proven blog post frameworks. Users can specify their target keywords for SEO optimization, while the prompt structure ensures the content remains engaging and natural. While there's potential for additional features like audience targeting and call-to-action customization, I've kept the current version focused and simple.

I made several deliberate choices in the prompt design, such as including a "Key Points" section in the conclusion. While not strictly necessary, these additions help create more comprehensive and reader-friendly blog posts in my opinion.

Since LLMs can sometimes hallucinate and generally perform better with specific inputs, I added an iterative improvement feature. After the initial generation, users can either regenerate the entire post or provide additional prompts to refine specific sections. This helps users who might not be familiar with LLM prompting get better results through guided iterations.

## Key Takeaways

There are three critical elements for building effective AI applications:

1. Well-crafted base prompts that guide the model effectively
2. Robust validation throughout the generation pipeline
3. A user interface that shields users from prompt engineering complexity

While Ghost Writer is intentionally kept simple, it delivers practical value for blog content creation. I welcome feature requests and improvements through GitHub issues and plan to enhance the tool's capabilities over time.
