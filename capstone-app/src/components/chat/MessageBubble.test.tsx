import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from './MessageBubble';
import type { UIMessage } from 'ai';

describe('MessageBubble Component', () => {
  it('renders a plain user message with appropriate accessible text', () => {
    const userMessage: UIMessage = {
      id: 'msg-1',
      role: 'user',
      parts: [
        {
          type: 'text',
          text: 'Qualify TechCorp with 250 employees in software',
        },
      ],
    };

    render(<MessageBubble message={userMessage} />);

    // Query by text content, independent of CSS class names or test IDs
    expect(
      screen.getByText(/Qualify TechCorp with 250 employees in software/i)
    ).toBeInTheDocument();
  });

  it('renders assistant markdown content including bold and list items', () => {
    const assistantMessage: UIMessage = {
      id: 'msg-2',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: '**Welcome!** Here are your candidate recommendations:\n- Senior Backend Engineer\n- AI Architect',
        },
      ],
    };

    render(<MessageBubble message={assistantMessage} />);

    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
    expect(screen.getByText(/Senior Backend Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Architect/i)).toBeInTheDocument();
  });

  it('renders the tool invocation loading state when execution is in progress', () => {
    const toolCallingMessage: UIMessage = {
      id: 'msg-3',
      role: 'assistant',
      parts: [
        {
          type: 'tool-scoreLead',
          toolCallId: 'call-123',
          state: 'call',
          input: {
            companyName: 'Acme SaaS',
            employeeCount: 150,
            industry: 'Technology',
          },
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ],
    };

    render(<MessageBubble message={toolCallingMessage} />);

    // Query by accessible status/text
    expect(screen.getByText(/Scoring lead\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluating Acme SaaS in Technology\.\.\./i)).toBeInTheDocument();
  });

  it('renders the completed tool execution card with score and tier results', () => {
    const toolResultMessage: UIMessage = {
      id: 'msg-4',
      role: 'assistant',
      parts: [
        {
          type: 'tool-scoreLead',
          toolCallId: 'call-456',
          state: 'result',
          input: { companyName: 'Enterprise AI Corp' },
          output: {
            companyName: 'Enterprise AI Corp',
            score: 95,
            tier: 'Tier 1',
            timestamp: new Date().toISOString(),
          },
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ],
    };

    render(<MessageBubble message={toolResultMessage} />);

    expect(screen.getByText(/Lead Scored/i)).toBeInTheDocument();
    expect(screen.getByText('Enterprise AI Corp')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('Tier 1')).toBeInTheDocument();
  });

  it('renders the error card when a tool execution fails', () => {
    const toolErrorMessage: UIMessage = {
      id: 'msg-5',
      role: 'assistant',
      parts: [
        {
          type: 'tool-scoreLead',
          toolCallId: 'call-789',
          state: 'result',
          errorText: 'Service unavailable or invalid company data.',
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ],
    };

    render(<MessageBubble message={toolErrorMessage} />);

    expect(screen.getByText(/Failed to score lead/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Service unavailable or invalid company data\./i)
    ).toBeInTheDocument();
  });
});
