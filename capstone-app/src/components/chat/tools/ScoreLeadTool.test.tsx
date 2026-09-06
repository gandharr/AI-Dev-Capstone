import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreLeadTool } from './ScoreLeadTool';

describe('ScoreLeadTool Component', () => {
  it('renders completed tool output with score, company name, and tier', () => {
    const mockInvocation = {
      toolCallId: 'call-1',
      toolName: 'scoreLead',
      state: 'result' as const,
      input: { companyName: 'Apex Innovations', industry: 'Fintech' },
      output: {
        companyName: 'Apex Innovations',
        score: 88,
        tier: 'Tier 1',
        timestamp: new Date().toISOString(),
      },
    };

    render(<ScoreLeadTool toolInvocation={mockInvocation as any} />);

    // Query by accessible text/content without CSS selectors
    expect(screen.getByText(/Lead Scored/i)).toBeInTheDocument();
    expect(screen.getByText('Apex Innovations')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
    expect(screen.getByText('Tier 1')).toBeInTheDocument();
  });

  it('renders error state with accessible failure message when tool execution fails', () => {
    const mockInvocation = {
      toolCallId: 'call-2',
      toolName: 'scoreLead',
      state: 'result' as const,
      errorText: 'API quota exceeded or rate limit reached',
    };

    render(<ScoreLeadTool toolInvocation={mockInvocation as any} />);

    expect(screen.getByText(/Failed to score lead/i)).toBeInTheDocument();
    expect(
      screen.getByText(/API quota exceeded or rate limit reached/i)
    ).toBeInTheDocument();
  });
});
