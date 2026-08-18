'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Chat Route Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background text-foreground p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-md w-full bg-card border border-border shadow-sm rounded-2xl p-6 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
            Something went wrong!
          </h2>
          <p className="text-sm text-muted-foreground">
            We encountered an unexpected error while trying to load the chat.
          </p>
          <div className="bg-muted p-3 rounded-md text-xs text-left overflow-auto max-h-32 text-muted-foreground mt-4">
            {error.message || 'Unknown error occurred.'}
          </div>
        </div>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <RefreshCcw size={16} />
          <span>Try again</span>
        </button>
      </motion.div>
    </div>
  );
}
