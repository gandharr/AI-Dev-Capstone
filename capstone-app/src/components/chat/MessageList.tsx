'use client';

import { type UIMessage } from 'ai';
import { MessageBubble } from './MessageBubble';
import { ThinkingIndicator } from './ThinkingIndicator';
import { AnimatePresence } from 'framer-motion';

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  // We want to show the thinking indicator only if we are loading and the 
  // last message is from the user (meaning the AI hasn't started streaming its response yet).
  // Once the AI starts streaming, its own message will be added to the list,
  // and the last message will be 'assistant'.
  const showThinking = isLoading && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="flex flex-col space-y-6 pb-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        {showThinking && (
          <ThinkingIndicator key="thinking" />
        )}
      </AnimatePresence>
    </div>
  );
}
