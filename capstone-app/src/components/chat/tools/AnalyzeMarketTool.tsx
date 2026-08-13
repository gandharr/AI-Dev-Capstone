'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, Loader2, TrendingDown, Minus } from 'lucide-react';
import type { UIToolInvocation } from 'ai';

interface AnalyzeMarketToolProps {
  toolInvocation: UIToolInvocation<any>;
}

export function AnalyzeMarketTool({ toolInvocation }: AnalyzeMarketToolProps) {
  const { state, input, output, errorText } = toolInvocation as any;

  // Find max value for SVG scaling
  const maxVal = output?.dataPoints ? Math.max(...output.dataPoints.map((d: any) => d.value)) : 100;
  
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
            <span className="text-sm">Preparing market analysis...</span>
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
              <span className="text-sm font-medium">Analyzing market trends...</span>
            </div>
            <div className="text-xs text-muted-foreground ml-8">
              Compiling data for {input?.industry || 'the requested sector'}...
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
                {output?.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : 
                 output?.trend === 'down' ? <TrendingDown className="w-5 h-5" /> : 
                 <Minus className="w-5 h-5" />}
                <span className="font-semibold capitalize">{output?.industry || 'Market'} Analysis</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-end space-x-2 h-32 w-full mt-2">
                {/* Hand-rolled SVG Bar Chart */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {output?.dataPoints?.map((point: any, index: number) => {
                    const width = 100 / output.dataPoints.length;
                    const height = (point.value / maxVal) * 100;
                    const x = index * width;
                    const y = 100 - height;
                    return (
                      <g key={index}>
                        <rect
                          x={x + (width * 0.1)} 
                          y={y}
                          width={width * 0.8}
                          height={height}
                          className="fill-primary/80 hover:fill-primary transition-colors"
                          rx="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {output?.dataPoints?.map((point: any, index: number) => (
                  <span key={index} className="flex-1 text-center truncate px-1">
                    {point.month}
                  </span>
                ))}
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
                <p className="font-semibold text-sm">Analysis failed</p>
                <p className="text-xs mt-1 opacity-90">
                  {errorText || 'Could not retrieve market data at this time.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
