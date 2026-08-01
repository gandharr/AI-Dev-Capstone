'use client';

import { motion } from 'framer-motion';

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-1.5 p-4 bg-muted/30 w-fit rounded-2xl rounded-tl-sm"
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/60"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/60"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/60"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </motion.div>
  );
}
