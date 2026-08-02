'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_STORAGE_KEY = 'capstone_chat_messages';

export function Chat() {
  const { messages, setMessages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    // We handle errors gracefully
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ parts: [{ type: 'text', text: input }], role: 'user' });
      setInput('');
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll<HTMLDivElement>();

  // Load from local storage on mount
  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }, [setMessages]);

  // Save to local storage on message change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  // Auto-scroll logic when messages update
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-card text-card-foreground shadow-sm">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask anything about our capstone project</p>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4 py-12">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-center max-w-md">
                Hi! I&apos;m here to help qualify your needs. What brings you to our service today?
              </p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} isLoading={isLoading} />
              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm mb-4 border border-red-500/20 max-w-2xl mx-auto">
                  <strong>Error:</strong> {error.message || 'An error occurred during chat.'}
                  <br />
                  If you see an API key error, make sure GOOGLE_GENERATIVE_AI_API_KEY is properly set in your Vercel Environment Variables and that you hit Redeploy!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Jump to bottom button */}
      <AnimatePresence>
        {!isAtBottom && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={() => scrollToBottom()}
              className="flex items-center space-x-2 bg-background border shadow-md rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <ArrowDown size={16} />
              <span>Jump to latest</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex-shrink-0 z-20">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
