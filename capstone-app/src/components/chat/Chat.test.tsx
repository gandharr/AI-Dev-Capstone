import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chat } from './Chat';
import { useChat } from '@ai-sdk/react';

// Mock the AI SDK hook completely so tests never hit any real AI backend/network
vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

describe('Chat Component', () => {
  const mockSendMessage = vi.fn();
  const mockSetMessages = vi.fn();
  const mockStop = vi.fn();
  const mockRegenerate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders pending/empty state with suggestions and triggers send on click', async () => {
    const user = userEvent.setup();

    (useChat as any).mockReturnValue({
      messages: [],
      setMessages: mockSetMessages,
      sendMessage: mockSendMessage,
      status: 'ready',
      stop: mockStop,
      error: undefined,
      regenerate: mockRegenerate,
    });

    render(<Chat />);

    // Check heading and empty state description queried by accessible role
    expect(
      screen.getByRole('heading', { name: /ai assistant/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();

    // Query suggestion buttons by text/role
    const analyzeButton = screen.getByRole('button', {
      name: /analyze market trends/i,
    });
    expect(analyzeButton).toBeInTheDocument();

    await user.click(analyzeButton);

    expect(mockSendMessage).toHaveBeenCalledWith({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: 'Analyze market trends for the AI software industry',
        },
      ],
    });
  });

  it('renders streaming state with stop button and active messages', async () => {
    const user = userEvent.setup();

    (useChat as any).mockReturnValue({
      messages: [
        {
          id: 'user-1',
          role: 'user',
          parts: [{ type: 'text', text: 'Score TechCorp' }],
        },
        {
          id: 'assistant-1',
          role: 'assistant',
          parts: [{ type: 'text', text: 'Analyzing company data...' }],
        },
      ],
      setMessages: mockSetMessages,
      sendMessage: mockSendMessage,
      status: 'streaming',
      stop: mockStop,
      error: undefined,
      regenerate: mockRegenerate,
    });

    render(<Chat />);

    // User message and streaming assistant message rendered
    expect(screen.getByText('Score TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Analyzing company data...')).toBeInTheDocument();

    // The chat input should show the Stop button accessible by role and aria-label
    const stopButton = screen.getByRole('button', {
      name: /stop generating/i,
    });
    expect(stopButton).toBeInTheDocument();

    await user.click(stopButton);
    expect(mockStop).toHaveBeenCalled();
  });

  it('renders error state with accessible alert message and retry button', async () => {
    const user = userEvent.setup();

    (useChat as any).mockReturnValue({
      messages: [
        {
          id: 'user-1',
          role: 'user',
          parts: [{ type: 'text', text: 'Calculate market size' }],
        },
      ],
      setMessages: mockSetMessages,
      sendMessage: mockSendMessage,
      status: 'ready',
      stop: mockStop,
      error: new Error('Rate limit exceeded. Please wait 60s.'),
      regenerate: mockRegenerate,
    });

    render(<Chat />);

    expect(screen.getByText('Calculate market size')).toBeInTheDocument();
    expect(
      screen.getByText(/failed to generate response/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/rate limit exceeded\. please wait 60s\./i)
    ).toBeInTheDocument();

    const retryButton = screen.getByRole('button', {
      name: /retry message/i,
    });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(mockRegenerate).toHaveBeenCalledTimes(1);
  });
});
