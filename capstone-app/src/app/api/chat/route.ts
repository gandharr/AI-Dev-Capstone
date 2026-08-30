import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { chatModel, chatSystemPrompt } from '@/lib/ai-config';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('Incoming messages:', JSON.stringify(messages, null, 2));

    // Ensure all messages have a parts array for convertToModelMessages compat
    const formattedMessages = (messages || []).map((m: { id?: string; role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => {
      if (!m.parts || m.parts.length === 0) {
        return {
          id: m.id,
          role: m.role,
          parts: [{ type: 'text', text: m.content || '' }],
        };
      }
      return m;
    });

    const coreMessages = await convertToModelMessages(formattedMessages); // Pass messages directly so tools work
    console.log('Core messages:', JSON.stringify(coreMessages, null, 2));

    const result = await streamText({
      model: chatModel,
      system: chatSystemPrompt,
      messages: coreMessages,
      tools: {
        scoreLead: tool({
          description: 'Score a lead based on company information. Use this once you know the company name, employee count, and industry.',
          parameters: z.object({
            companyName: z.string().describe('The name of the company.'),
            employeeCount: z.number().describe('The number of employees at the company.'),
            industry: z.string().describe('The industry the company operates in.'),
          }),
          // @ts-expect-error - AI SDK Tool params type mismatch
          execute: async ({ companyName, employeeCount, industry }: { companyName: string; employeeCount: number; industry: string }) => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Intentionally throw an error for testing the error state
            if (companyName.toLowerCase().includes('error')) {
              throw new Error('Failed to score lead: Service unavailable or invalid company data.');
            }

            // Basic scoring logic
            let score = 50;
            if (employeeCount > 100) score += 20;
            if (employeeCount > 1000) score += 10;
            if (['software', 'technology', 'saas'].includes(industry.toLowerCase())) score += 20;

            return {
              companyName,
              score: Math.min(100, Math.max(0, score)),
              tier: score >= 80 ? 'Tier 1' : score >= 60 ? 'Tier 2' : 'Tier 3',
              timestamp: new Date().toISOString(),
            };
          },
        }),
        analyzeMarketTrends: tool({
          description: 'Analyze market trends for a specific industry or sector. Use this when asked about trends, growth, or market charts.',
          parameters: z.object({
            industry: z.string().describe('The industry to analyze (e.g., tech, healthcare, finance)'),
          }),
          // @ts-expect-error - AI SDK Tool params type mismatch
          execute: async ({ industry }: { industry: string }) => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Intentionally throw an error for testing the error state
            if (industry.toLowerCase().includes('error')) {
              throw new Error('Failed to fetch market data: Service unavailable.');
            }

            // Generate some mock data for the chart
            const baseValue = Math.floor(Math.random() * 50) + 50;
            const trend = Math.random() > 0.5 ? 'up' : 'down';
            const dataPoints = Array.from({ length: 6 }).map((_, i) => {
              const variance = Math.floor(Math.random() * 20) - 10;
              return {
                month: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString('default', { month: 'short' }),
                value: Math.max(10, baseValue + (trend === 'up' ? i * 10 : i * -10) + variance),
              };
            });

            return {
              industry,
              trend,
              dataPoints,
            };
          },
        }),
      },
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
