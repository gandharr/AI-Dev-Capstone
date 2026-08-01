import { streamText } from 'ai';
import { chatModel, chatSystemPrompt } from '@/lib/ai-config';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.parts?.map((p: any) => p.text).join('') || msg.content || ''
    }));

    const result = await streamText({
      model: chatModel,
      system: chatSystemPrompt,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
