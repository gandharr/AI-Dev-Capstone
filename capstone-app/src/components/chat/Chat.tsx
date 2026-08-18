'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { ArrowDown, MessageSquare, TrendingUp, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_STORAGE_KEY = 'capstone_chat_messages';

export function Chat() {
  const { messages, setMessages, sendMessage, status, stop, error, reload } = useChat({
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

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      sendMessage({ parts: [{ type: 'text', text: suggestion }], role: 'user' });
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
    <div className="flex flex-col h-[100dvh] bg-background overscroll-none">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-card text-card-foreground shadow-sm z-10 relative">
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
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">No conversations yet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mt-2">
                    Start chatting or try one of the examples below to see what I can do.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <button
                  onClick={() => handleSuggestionClick("Analyze market trends for the AI software industry")}
                  className="flex flex-col items-start p-4 bg-card border rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <TrendingUp className="w-5 h-5 mb-2 text-primary" />
                  <span className="font-medium text-sm">Analyze market trends</span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-2">See a breakdown of AI software market trends.</span>
                </button>
                <button
                  onClick={() => handleSuggestionClick("Score a lead for a tech company with 500 employees")}
                  className="flex flex-col items-start p-4 bg-card border rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <Building2 className="w-5 h-5 mb-2 text-primary" />
                  <span className="font-medium text-sm">Score a lead</span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-2">Test out the lead scoring capabilities.</span>
                </button>
              </div>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              error={error} 
              reload={reload} 
            />
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
      <div className="flex-shrink-0 z-20 bg-background/80 backdrop-blur-sm border-t pb-safe">
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
