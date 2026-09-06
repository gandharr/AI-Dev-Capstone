'use client';

import React, { useState } from 'react';
import { MotionButton } from '@/components/ui/MotionButton';
import { Send, Rocket, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function ButtonsDemoPage() {
  // State for Button 1 (Qualify Lead / Send)
  const [btn1Disabled, setBtn1Disabled] = useState(false);
  const [lastActionStatus1, setLastActionStatus1] = useState<string>('Ready');

  // State for Button 2 (System Flex: Deploy Agent / Generate)
  const [btn2Disabled, setBtn2Disabled] = useState(false);
  const [lastActionStatus2, setLastActionStatus2] = useState<string>('Ready');

  // Async simulation function with configurable delay and failure rate
  const simulateAsyncAction = async (delayMs: number, failRate: number, setStatus: (s: string) => void): Promise<boolean> => {
    setStatus('Dispatching async request...');
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const isFailure = Math.random() < failRate;
    if (isFailure) {
      setStatus(`Failed! (Network/Server simulated failure at ${new Date().toLocaleTimeString()})`);
      return false; // Triggers Error state
    }

    setStatus(`Success! (Action resolved in ${delayMs}ms at ${new Date().toLocaleTimeString()})`);
    return true; // Triggers Success state
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive State Machine & Motion Choreography</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The Lifecycle Button System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            A state-communicating component that handles its full lifecycle (<span className="text-foreground font-medium">Idle &rarr; Hover &rarr; Loading &rarr; Success / Error &rarr; Idle</span>) without a single abrupt visual swap.
          </p>
        </div>

        {/* Showcase Grid: Two Buttons Sharing One Motion Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Primary Action Button (Capstone Chat / Qualify Lead) */}
          <div className="p-8 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary System Button</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">Variant: Primary</span>
              </div>
              <h2 className="text-xl font-bold">Qualify Lead & Send</h2>
              <p className="text-sm text-muted-foreground">
                Reused in the Capstone Chat interface. Handles form submission, server qualification tool streaming, and graceful error recovery.
              </p>
            </div>

            {/* The Live Button Stage */}
            <div className="py-10 px-6 rounded-xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center gap-4 min-h-[160px]">
              <MotionButton
                size="lg"
                variant="accent"
                disabled={btn1Disabled}
                idleIcon={<Send className="w-4 h-4 ml-1.5" />}
                loadingText="Qualifying Lead..."
                successText="Lead Qualified!"
                errorText="Failed — Retry"
                onAction={() => simulateAsyncAction(1400, 0.2, setLastActionStatus1)}
              >
                Qualify Lead
              </MotionButton>
              <div className="text-xs font-mono text-muted-foreground text-center">
                Status: <span className="text-foreground font-medium">{lastActionStatus1}</span>
              </div>
            </div>

            {/* Trigger Controls */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manual State Triggers</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(1000, 0.0, setLastActionStatus1)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Force Success
                </button>
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(1000, 1.0, setLastActionStatus1)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Force Error (Shake)
                </button>
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(3200, 0.2, setLastActionStatus1)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" /> Slow Network (3.2s)
                </button>
                <button
                  type="button"
                  onClick={() => setBtn1Disabled(!btn1Disabled)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Toggle Disabled
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Secondary Action Button (System Flex: Deploy Agent) */}
          <div className="p-8 rounded-2xl border bg-card/60 backdrop-blur-md shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secondary System Button</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">System Flex</span>
              </div>
              <h2 className="text-xl font-bold">Deploy Agent Scout</h2>
              <p className="text-sm text-muted-foreground">
                Shares the exact same choreography, spring physics, and compositor-friendly properties, proving a cohesive system.
              </p>
            </div>

            {/* The Live Button Stage */}
            <div className="py-10 px-6 rounded-xl bg-muted/40 border border-border/50 flex flex-col items-center justify-center gap-4 min-h-[160px]">
              <MotionButton
                size="lg"
                variant="secondary"
                disabled={btn2Disabled}
                idleIcon={<Rocket className="w-4 h-4 ml-1.5 text-primary" />}
                loadingText="Deploying Scout..."
                successText="Agent Live!"
                errorText="Build Failed"
                onAction={() => simulateAsyncAction(1600, 0.2, setLastActionStatus2)}
              >
                Deploy Scout
              </MotionButton>
              <div className="text-xs font-mono text-muted-foreground text-center">
                Status: <span className="text-foreground font-medium">{lastActionStatus2}</span>
              </div>
            </div>

            {/* Trigger Controls */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manual State Triggers</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(1000, 0.0, setLastActionStatus2)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Force Success
                </button>
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(1000, 1.0, setLastActionStatus2)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Force Error (Shake)
                </button>
                <button
                  type="button"
                  onClick={() => simulateAsyncAction(3200, 0.2, setLastActionStatus2)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" /> Slow Network (3.2s)
                </button>
                <button
                  type="button"
                  onClick={() => setBtn2Disabled(!btn2Disabled)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 border text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Toggle Disabled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Rationale & Design Note Card */}
        <div className="p-8 rounded-2xl border bg-card/40 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold">Motion Choreography & Duration / Easing Choices</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/40">
              <h3 className="font-semibold text-foreground">1. Durations Chosen on Purpose</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Hover / Tap (150ms):</strong> Sits under the human 100-200ms perceptual threshold for instant tactile feedback.<br />
                <strong>State Swaps (180ms - 280ms):</strong> Content cross-fades quickly to keep the interface feeling nimble.<br />
                <strong>Success / Error Hold (2200ms):</strong> Gives users sufficient cognitive time to register confirmation before resetting.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/40">
              <h3 className="font-semibold text-foreground">2. Spring Physics & Easings</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Spring Curve (`stiffness: 450, damping: 28`):</strong> Applied to the checkmark entrance for a subtle, celebratory overshoot without feeling cartoonish.<br />
                <strong>Cubic Bezier (`[0.16, 1, 0.3, 1]`):</strong> Natural decelerating curve ensuring elements enter at peak speed and settle gently into place.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/40">
              <h3 className="font-semibold text-foreground">3. Compositor & Accessibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Zero Layout Thrash:</strong> Only GPU-accelerated properties (`transform`, `opacity`) are animated. No reflow-triggering width/height shifts.<br />
                <strong>Reduced Motion (`prefers-reduced-motion`):</strong> Automatically detects OS accessibility settings. Positional shakes and scale zooms are disabled; color and icon feedback remain intact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
