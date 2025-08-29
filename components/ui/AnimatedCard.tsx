"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
}

export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
  onClick,
  hover = true,
  glow = false,
}: AnimatedCardProps) {
  const baseClasses = `card p-6 ${glow ? "card-glow" : ""}`;
  
  return (
    <motion.div
      className={`${baseClasses} ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
      whileHover={hover && onClick ? { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}