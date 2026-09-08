import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

describe('Chat API Route — Production Hygiene & Abuse Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests with malformed or non-array messages with HTTP 400', async () => {
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('non-empty "messages" array');
  });

  it('rejects conversation histories exceeding 25 messages with HTTP 400', async () => {
    const messages = Array.from({ length: 26 }, (_, i) => ({
      id: `msg-${i}`,
      role: 'user',
      content: `Message ${i}`,
    }));

    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Conversation history exceeds maximum depth');
  });

  it('rejects messages exceeding 1,500 characters with HTTP 400', async () => {
    const longText = 'a'.repeat(1501);
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: longText }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Message content exceeds maximum allowed limit');
  });

  it('triggers HTTP 429 rate limiting when requests exceed threshold for an IP', async () => {
    const testIp = '198.51.100.42';

    // Send 12 rapid requests from testIp to exhaust quota
    for (let i = 0; i < 12; i++) {
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Ping ${i}` }],
        }),
      });
      await POST(req);
    }

    // 13th request must be rejected with 429
    const burstReq = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Throttled message' }],
      }),
    });

    const res = await POST(burstReq);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
    const data = await res.json();
    expect(data.error).toContain('Rate limit exceeded');
  });
});
