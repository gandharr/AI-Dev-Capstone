/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { UIToolInvocation } from 'ai';

interface ScoreLeadToolProps {
  toolInvocation: UIToolInvocation<any>;
}

export function ScoreLeadTool({ toolInvocation }: ScoreLeadToolProps) {
  // Extract state and details
  const { state, input, output, errorText } = toolInvocation as any;

  return (
    <motion.div layout className="my-4 border rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm relative">
      <AnimatePresence mode="popLayout">
        {state === 'input-streaming' && (
          <motion.div
            layout
            key="input-streaming"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 flex items-center space-x-3 text-muted-foreground w-full"
          >
            <Loader2 className="animate-spin w-5 h-5 text-primary" />
            <span className="text-sm">Gathering company info...</span>
          </motion.div>
        )}

        {state === 'input-available' && (
          <motion.div
            layout
            key="input-available"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 flex flex-col space-y-2 bg-muted/30 w-full"
          >
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Scoring lead...</span>
            </div>
            <div className="text-xs text-muted-foreground ml-8">
              Evaluating {input?.companyName || 'company'} in {input?.industry || 'industry'}...
            </div>
          </motion.div>
        )}

        {state === 'output-available' && (
          <motion.div
            layout
            key="output-available"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-0 w-full"
          >
            <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-primary/10">
              <div className="flex items-center space-x-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Lead Scored</span>
              </div>
              <span className="text-xs font-mono bg-background px-2 py-1 rounded-md border text-muted-foreground">
                {output?.timestamp ? new Date(output.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company</p>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{output?.companyName}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-primary">{output?.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tier</p>
                <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                  {output?.tier}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {state === 'output-error' && (
          <motion.div
            layout
            key="output-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-destructive/10 border-l-4 border-destructive w-full"
          >
            <div className="flex items-start space-x-3 text-destructive">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Failed to score lead</p>
                <p className="text-xs mt-1 opacity-90">
                  {errorText || 'An unexpected error occurred during execution.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
