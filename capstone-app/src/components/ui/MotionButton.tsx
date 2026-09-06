'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface MotionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'size'> {
  children?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  idleIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  onAction?: () => Promise<boolean | void>;
  forceState?: ButtonState;
  className?: string;
  autoResetDelay?: number;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(({
  children = 'Submit',
  loadingText = 'Processing...',
  successText = 'Success!',
  errorText = 'Error — Retry',
  idleIcon = <ArrowRight className="w-4 h-4 ml-1.5" />,
  variant = 'primary',
  size = 'md',
  onAction,
  forceState,
  disabled = false,
  className,
  autoResetDelay = 2200,
  onClick,
  ...props
}, ref) => {
  const [internalState, setInternalState] = useState<ButtonState>('idle');
  const currentState = forceState !== undefined ? forceState : internalState;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (currentState === 'loading' || disabled) return;

    // Interruptibility: clear any pending auto-reset timer if clicked again
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (onAction) {
      setInternalState('loading');
      try {
        const result = await onAction();
        // If the action explicitly returns false, treat as error; otherwise success
        if (result === false) {
          setInternalState('error');
          timeoutRef.current = setTimeout(() => {
            setInternalState('idle');
          }, autoResetDelay);
        } else {
          setInternalState('success');
          timeoutRef.current = setTimeout(() => {
            setInternalState('idle');
          }, autoResetDelay);
        }
      } catch {
        setInternalState('error');
        timeoutRef.current = setTimeout(() => {
          setInternalState('idle');
        }, autoResetDelay);
      }
    }
  };

  // Base sizing tokens
  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs font-medium rounded-lg',
    md: 'h-11 px-5 text-sm font-semibold rounded-xl',
    lg: 'h-13 px-7 text-base font-semibold rounded-2xl',
  }[size];

  // Dynamic color palette per state
  const stateColors = {
    idle: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
      accent: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/25',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }[variant],
    loading: 'bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-wait',
    success: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    error: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
  }[currentState];

  // Micro-shake keyframes for error (bypassed if user prefers reduced motion)
  const shakeKeyframes = shouldReduceMotion 
    ? { x: 0 } 
    : { x: [0, -6, 6, -4, 4, -2, 2, 0] };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      disabled={disabled || currentState === 'loading'}
      aria-busy={currentState === 'loading'}
      aria-live="polite"
      aria-disabled={disabled || currentState === 'loading'}
      layout
      transition={{
        layout: { duration: 0.2, ease: 'easeOut' },
      }}
      animate={currentState === 'error' ? shakeKeyframes : { x: 0 }}
      whileHover={!disabled && currentState === 'idle' ? (shouldReduceMotion ? {} : { scale: 1.02, y: -1 }) : {}}
      whileTap={!disabled && currentState === 'idle' ? (shouldReduceMotion ? {} : { scale: 0.97 }) : {}}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden select-none transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        disabled && 'opacity-50 cursor-not-allowed shadow-none hover:scale-100',
        sizeStyles,
        stateColors,
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {currentState === 'idle' && (
          <motion.span
            key="idle"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="inline-flex items-center gap-1.5"
          >
            {children}
            {idleIcon}
          </motion.span>
        )}

        {currentState === 'loading' && (
          <motion.span
            key="loading"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
            <span>{loadingText}</span>
          </motion.span>
        )}

        {currentState === 'success' && (
          <motion.span
            key="success"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: [0.7, 1.15, 1] }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 font-semibold"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{successText}</span>
          </motion.span>
        )}

        {currentState === 'error' && (
          <motion.span
            key="error"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="inline-flex items-center gap-1.5 font-semibold"
          >
            <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{errorText}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

MotionButton.displayName = 'MotionButton';
