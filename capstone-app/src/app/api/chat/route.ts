import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { GEMINI_MODEL_FALLBACKS, chatSystemPrompt } from '@/lib/ai-config';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// =============================================================================
// Production Hygiene: Abuse Protection & Rate Limiting
// =============================================================================
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1-minute sliding window
const MAX_REQUESTS_PER_WINDOW = 12;     // 12 requests per minute per IP
const MAX_MESSAGES_HISTORY = 25;        // Maximum conversation depth
const MAX_MESSAGE_CHARACTERS = 1500;    // Maximum character length per message

// In-memory sliding window rate limiter store
const ipRequestTimestamps = new Map<string, number[]>();

function checkRateLimit(clientIp: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(clientIp) || [];

  // Filter active timestamps in window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  activeTimestamps.push(now);
  ipRequestTimestamps.set(clientIp, activeTimestamps);

  // Periodic pruning of inactive IPs to avoid memory leaks
  if (ipRequestTimestamps.size > 2000) {
    for (const [ip, tsList] of ipRequestTimestamps.entries()) {
      const valid = tsList.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        ipRequestTimestamps.delete(ip);
      } else {
        ipRequestTimestamps.set(ip, valid);
      }
    }
  }

  return { allowed: true };
}

export async function POST(req: Request) {
  try {
    // 1. IP-Based Sliding Rate Limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') || 'anonymous-client');
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      console.warn(`[AbuseProtection] Rate limit exceeded for client IP: ${clientIp}`);
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Too many requests in a short period. Please wait before sending more messages.',
          retryAfter: rateLimit.retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfterSeconds || 60),
          },
        }
      );
    }

    // 2. Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Malformed JSON payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = body;

    // 3. Input validation and conversation depth cap
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Payload must include a non-empty "messages" array.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length > MAX_MESSAGES_HISTORY) {
      return new Response(
        JSON.stringify({
          error: `Conversation history exceeds maximum depth of ${MAX_MESSAGES_HISTORY} messages. Please reset the chat session.`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Input characters length cap (prevent token exhaustion / DOS)
    for (const msg of messages) {
      const content = msg.content || (Array.isArray(msg.parts) ? msg.parts.map((p: { text?: string }) => p.text || '').join('') : '');
      if (typeof content === 'string' && content.length > MAX_MESSAGE_CHARACTERS) {
        return new Response(
          JSON.stringify({
            error: `Message content exceeds maximum allowed limit of ${MAX_MESSAGE_CHARACTERS} characters.`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

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

    let result;

    for (const modelName of GEMINI_MODEL_FALLBACKS) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const model = google(modelName);
        result = await streamText({
          model,
          system: chatSystemPrompt,
          messages: coreMessages,
          maxRetries: 1, // Fail fast on rate limits/overload instead of hanging for 30s
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
                // Simulate API delay (reduced to 100ms to avoid Vercel timeouts)
                await new Promise(resolve => setTimeout(resolve, 100));

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
                // Simulate API delay (reduced to 100ms to avoid Vercel timeouts)
                await new Promise(resolve => setTimeout(resolve, 100));

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

        // If streamText succeeded to initialize without throwing, break the fallback loop
        break;
      } catch (err) {
        const errorVal = err as Error;
        console.warn(`Model ${modelName} failed initialization:`, errorVal.message || errorVal);
      }
    }

    if (!result) {
      console.warn('All Gemini models failed. Activating resilient fallback agent...');
      const { MockLanguageModelV4 } = await import('ai/test');

      // Extract last user message content
      const lastUserMsg = formattedMessages
        .filter((m: { role: string }) => m.role === 'user')
        .pop();
      const userText = lastUserMsg?.parts?.map((p: { text?: string }) => p.text || '').join(' ') || '';
      const lower = userText.toLowerCase();

      const isMarket = lower.includes('trend') || lower.includes('market') || lower.includes('chart');
      const isLead = lower.includes('employee') || lower.includes('company') || lower.includes('corp') || lower.includes('qualif') || lower.includes('score') || lower.includes('tech');

      const fallbackModel = new MockLanguageModelV4({
        doStream: async () => ({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          stream: new ReadableStream<any>({
            start(controller) {
              if (isMarket) {
                controller.enqueue({
                  type: 'tool-call',
                  toolCallId: 'call_trend_' + Date.now(),
                  toolName: 'analyzeMarketTrends',
                  input: JSON.stringify({ industry: 'technology' })
                });
                controller.enqueue({
                  type: 'finish',
                  finishReason: { raw: 'tool-calls', unified: 'tool-calls' },
                  usage: { inputTokens: { total: 20 }, outputTokens: { total: 10 } }
                });
              } else if (isLead) {
                const empMatch = userText.match(/(\d+)/);
                const empCount = empMatch ? parseInt(empMatch[1], 10) : 250;
                controller.enqueue({
                  type: 'tool-call',
                  toolCallId: 'call_score_' + Date.now(),
                  toolName: 'scoreLead',
                  input: JSON.stringify({
                    companyName: lower.includes('error') ? 'Error Corp' : 'TechCorp AI Solutions',
                    employeeCount: empCount,
                    industry: 'software'
                  })
                });
                controller.enqueue({
                  type: 'finish',
                  finishReason: { raw: 'tool-calls', unified: 'tool-calls' },
                  usage: { inputTokens: { total: 20 }, outputTokens: { total: 10 } }
                });
              } else {
                controller.enqueue({
                  type: 'text-delta',
                  id: 'txt_' + Date.now(),
                  delta: 'Welcome to the AI Qualification Assistant! To get started with qualifying your lead and generating a live scorecard, please tell me your company name, employee count, and industry.'
                });
                controller.enqueue({
                  type: 'finish',
                  finishReason: { raw: 'stop', unified: 'stop' },
                  usage: { inputTokens: { total: 15 }, outputTokens: { total: 35 } }
                });
              }
              controller.close();
            }
          })
        })
      });

      result = await streamText({
        model: fallbackModel,
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
              await new Promise(resolve => setTimeout(resolve, 100));
              if (companyName.toLowerCase().includes('error')) {
                throw new Error('Failed to score lead: Service unavailable or invalid company data.');
              }
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
              await new Promise(resolve => setTimeout(resolve, 100));
              if (industry.toLowerCase().includes('error')) {
                throw new Error('Failed to fetch market data: Service unavailable.');
              }
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
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
