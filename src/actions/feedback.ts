'use server';

type FeedbackParams = {
  requestId: string;
  result: boolean;
};

// This updates the LLM call feedback
export async function feedback({ requestId, result }: FeedbackParams) {
  if (!process.env.HELICONE_API_KEY) {
    return;
  }
  const options = {
    method: 'POST',
    headers: {
      'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating: result,
    }),
  };

  try {
    const response = await fetch(
      `https://api.helicone.ai/v1/request/${requestId}/feedback`,
      options
    );

    // Normally the response should be success: response.ok but on free tier the custom values are not supported :)
    // Just put it here for the self host version
    return { success: response.ok };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    if (error instanceof Error) {
      throw new Error(`Error submitting feedback: ${error.message}`);
    }
    throw new Error('Unexpected error submitting feedback');
  }
}
