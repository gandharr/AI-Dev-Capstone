'use client';

import { type UIMessage } from 'ai';
import { MessageBubble } from './MessageBubble';
import { MessageSkeleton } from './MessageSkeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  error?: Error;
  reload?: () => void;
}

export function MessageList({ messages, isLoading, error, reload }: MessageListProps) {
  const isAssistantEmpty = (m?: UIMessage) => {
    if (m?.role !== 'assistant') return false;
    
    const content = m.content;
    if (content && typeof content === 'string' && content.length > 0) return false;
    
    // In AI SDK, tool calls are stored in toolInvocations array
    const toolInvocations = (m as Record<string, unknown>).toolInvocations as unknown[] | undefined;
    if (toolInvocations && toolInvocations.length > 0) return false;
    
    if (!m.parts || m.parts.length === 0) {
      return !content; // If no parts and no content, it's empty
    }
    
    // Check if there are any non-empty text parts or ANY non-text parts (like tool-call)
    const hasContent = m.parts.some((p: { type: string; text?: string }) => {
      if (p.type === 'text') {
        return p.text && p.text.length > 0;
      }
      return true; // tool-call, reasoning, etc. all count as content
    });
    
    return !hasContent;
  };

  const isLastMessageEmptyAssistant = isAssistantEmpty(messages[messages.length - 1]);

  // Show thinking indicator if waiting for AI to respond (after user message) 
  // or if the AI message has been created but is still empty
  const showThinking = isLoading && (messages[messages.length - 1]?.role === 'user' || isLastMessageEmptyAssistant);

  // Filter out empty assistant messages so they don't render as tiny empty bubbles
  const visibleMessages = messages.filter(m => !isAssistantEmpty(m));

  return (
    <div className="flex flex-col space-y-6 pb-4">
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        {showThinking && (
          <MessageSkeleton key="thinking" />
        )}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex w-full justify-start"
          >
            <div className="flex flex-col space-y-3 max-w-[85%] sm:max-w-[75%]">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Failed to generate response</p>
                  <p className="opacity-90">{error.message || 'An unexpected error occurred. Please try again.'}</p>
                </div>
              </div>
              {reload && (
                <button
                  onClick={() => reload()}
                  className="self-start flex items-center space-x-2 bg-background border shadow-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors text-foreground"
                >
                  <RefreshCcw size={14} />
                  <span>Retry message</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
