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
  // We want to show the thinking indicator only if we are loading and the 
  // last message is from the user (meaning the AI hasn't started streaming its response yet).
  // Once the AI starts streaming, its own message will be added to the list,
  // and the last message will be 'assistant'.
  const showThinking = isLoading && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="flex flex-col space-y-6 pb-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
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
