"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: "primary" | "secondary" | "accent";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  color = "primary",
  showLabel = true,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  const colorClasses = {
    primary: "from-primary-400 to-primary-600",
    secondary: "from-secondary-400 to-secondary-600",
    accent: "from-accent-400 to-accent-600"
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || "進捗"}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {current}/{total}
          </span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/30 animate-shimmer" />
        </motion.div>
      </div>
      
      {percentage === 100 && (
        <motion.div
          className="mt-2 flex items-center space-x-1 text-green-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">完了!</span>
        </motion.div>
      )}
    </div>
  );
}