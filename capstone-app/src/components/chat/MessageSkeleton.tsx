'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function MessageSkeleton() {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex w-full justify-start group"
    >
      <div className="flex max-w-[85%] sm:max-w-[75%] space-x-3 items-end flex-row">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
          <Bot size={16} />
        </div>
        
        <div className="flex flex-col px-4 py-3 rounded-2xl text-sm leading-relaxed min-w-[200px] w-full max-w-[250px] bg-muted/50 text-foreground rounded-bl-sm border border-border/50 space-y-2">
          <div className="h-3.5 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
          <div className="h-3.5 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
          <div className="h-3.5 bg-muted-foreground/20 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </motion.div>
  );
}
