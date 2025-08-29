"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  duration?: number;
}

export default function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  showPercentage = true,
  label,
  animated = true,
  duration = 2
}: CircularProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (animatedProgress / 100) * circumference }}
          transition={{ 
            duration: animated ? duration : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated glow effect */}
        {animated && progress > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth + 2}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity={0.3}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span 
            className="text-2xl font-bold text-gray-800"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: duration * 0.5, duration: 0.3 }}
          >
            {Math.round(animatedProgress)}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-gray-600 text-center mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}