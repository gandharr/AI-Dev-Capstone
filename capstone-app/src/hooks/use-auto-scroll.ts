import { useEffect, useRef, useState, useCallback } from 'react';

export function useAutoScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Consider "at bottom" if within 50px of the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollRef.current) return;
    
    if (typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Optimistically set to true to prevent scroll jumps
    setIsAtBottom(true);
  }, []);

  // Listen for scroll events to detect if user manually scrolled up
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return {
    scrollRef,
    isAtBottom,
    scrollToBottom,
  };
}
