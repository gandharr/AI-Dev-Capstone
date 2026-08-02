'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ToolInvocation } from 'ai';

interface ScoreLeadToolProps {
  toolInvocation: ToolInvocation;
}

export function ScoreLeadTool({ toolInvocation }: ScoreLeadToolProps) {
  // Extract state and details
  const { state, args } = toolInvocation;

  // We can treat anything that throws or returns a recognizable error object as an error state
  const isError = state === 'result' && (
    (typeof toolInvocation.result === 'string' && toolInvocation.result.toLowerCase().includes('error')) ||
    (toolInvocation.result && typeof toolInvocation.result === 'object' && toolInvocation.result.error)
  );

  return (
    <div className="my-4 border rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm">
      <AnimatePresence mode="wait">
        {state === 'partial-call' && (
          <motion.div
            key="partial-call"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 flex items-center space-x-3 text-muted-foreground"
          >
            <Loader2 className="animate-spin w-5 h-5 text-primary" />
            <span className="text-sm">Gathering company info...</span>
          </motion.div>
        )}

        {state === 'call' && (
          <motion.div
            key="call"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 flex flex-col space-y-2 bg-muted/30"
          >
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Scoring lead...</span>
            </div>
            <div className="text-xs text-muted-foreground ml-8">
              Evaluating {args?.companyName || 'company'} in {args?.industry || 'industry'}...
            </div>
          </motion.div>
        )}

        {state === 'result' && !isError && (
          <motion.div
            key="result-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-0"
          >
            <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-primary/10">
              <div className="flex items-center space-x-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Lead Scored</span>
              </div>
              <span className="text-xs font-mono bg-background px-2 py-1 rounded-md border text-muted-foreground">
                {toolInvocation.result?.timestamp ? new Date(toolInvocation.result.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company</p>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{toolInvocation.result?.companyName}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-primary">{toolInvocation.result?.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tier</p>
                <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                  {toolInvocation.result?.tier}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {state === 'result' && isError && (
          <motion.div
            key="result-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-destructive/10 border-l-4 border-destructive"
          >
            <div className="flex items-start space-x-3 text-destructive">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Failed to score lead</p>
                <p className="text-xs mt-1 opacity-90">
                  {typeof toolInvocation.result === 'string' 
                    ? toolInvocation.result 
                    : toolInvocation.result?.error || 'An unexpected error occurred during execution.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
