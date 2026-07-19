"use client";

import { motion } from "framer-motion";

/* ----------------------------------------------------------------------------
 * Appear — a smooth, one-time fade + rise reveal.
 * - Default: animates on mount (for above-the-fold content, sequenced by delay).
 * - inView: animates once when scrolled into view (for everything below the fold).
 * Never repeats.
 * --------------------------------------------------------------------------*/

const EASE = [0.22, 1, 0.36, 1] as const;

type AppearProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  inView?: boolean;
};

export default function Appear({
  children,
  delay = 0,
  y = 16,
  className,
  inView = false,
}: AppearProps) {
  const transition = { duration: 0.6, ease: EASE, delay };

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
