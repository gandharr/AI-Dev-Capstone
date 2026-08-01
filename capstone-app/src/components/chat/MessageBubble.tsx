'use client';

import { motion } from 'framer-motion';
import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { memo } from 'react';

interface MessageBubbleProps {
  message: UIMessage;
}

// Memoize to prevent unnecessary re-renders of older messages
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex w-full group',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] sm:max-w-[75%] space-x-3 items-end',
          isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        )}
      >
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none break-words',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted/50 text-foreground rounded-bl-sm border border-border/50'
          )}
        >
          {/* 
            Using react-markdown with remarkGfm for robust markdown rendering.
            It handles partial/streaming markdown surprisingly well if we let it
            re-render as text chunks arrive.
          */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Add custom component styling if needed
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              pre({ children }) {
                return <pre className="p-2 rounded bg-black/10 dark:bg-white/10 overflow-x-auto">{children}</pre>;
              },
              code({ className, children, ...props }) {
                const { node, ...rest } = props as typeof props & { node?: unknown };
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5" {...rest}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.parts?.filter((p: { type: string }) => p.type === 'text').map((p: { type: string, text?: string }) => p.text).join('\n') || ''}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
});
