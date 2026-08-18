'use client';

import { cn } from '@/lib/utils';
import { ArrowUp, Square } from 'lucide-react';
import { type FormEvent, type ChangeEvent, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading, stop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Max height of 200px before scrolling
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [input]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        // Trigger submit
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  };

  const isSubmitDisabled = !input.trim() || isLoading;

  return (
    <div className="p-4 bg-background border-t">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSubmitDisabled) {
            handleSubmit(e);
          }
        }}
        className="max-w-3xl mx-auto relative flex items-end bg-muted/50 rounded-3xl border focus-within:ring-1 focus-within:ring-primary/50 transition-shadow"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder="Message AI..."
          className="w-full max-h-[200px] bg-transparent resize-none px-4 py-3.5 focus:outline-none text-base sm:text-sm disabled:opacity-50"
          rows={1}
          disabled={isLoading}
        />
        
        <div className="absolute right-2 bottom-2">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.button
                key="stop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={stop}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-destructive-foreground shadow-sm"
                aria-label="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
                whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
                type="submit"
                disabled={isSubmitDisabled}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                  isSubmitDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground shadow-sm"
                )}
                aria-label="Send message"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
      <div className="text-center text-xs text-muted-foreground mt-2">
        AI can make mistakes. Check important info.
      </div>
    </div>
  );
}
