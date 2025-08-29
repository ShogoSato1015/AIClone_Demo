"use client";

import { motion } from "framer-motion";

interface LoadingAnimationProps {
  message?: string;
  type?: "dots" | "spinner" | "pulse" | "creation";
}

export default function LoadingAnimation({
  message = "読み込み中...",
  type = "creation",
}: LoadingAnimationProps) {
  if (type === "dots") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">{message}</p>
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-12 h-12 bg-primary-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
        <p className="text-gray-600">{message}</p>
      </div>
    );
  }

  // Creation type - special animation for content generation
  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="relative">
        {/* Central hub */}
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <span className="text-white text-xl">🎭</span>
        </motion.div>

        {/* Orbiting elements */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-16px",
              marginLeft: "-16px",
            }}
            animate={{
              rotate: 360,
              x: Math.cos((i * 120 * Math.PI) / 180) * 40,
              y: Math.sin((i * 120 * Math.PI) / 180) * 40,
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <span className="text-white text-sm">
              {i === 0 ? "💭" : i === 1 ? "✨" : "🎪"}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center space-y-2"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-lg font-semibold gradient-text">{message}</p>
        <p className="text-sm text-gray-500">二人が袖で相談中...</p>
      </motion.div>

      {/* Progress indicator */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}