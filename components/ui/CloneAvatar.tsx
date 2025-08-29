"use client";

import { motion } from "framer-motion";
import { CloneLook } from "@/types";

interface CloneAvatarProps {
  look: CloneLook;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showDetails?: boolean;
  className?: string;
}

export default function CloneAvatar({
  look,
  size = "md",
  animated = true,
  showDetails = false,
  className = "",
}: CloneAvatarProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  // シンプルなアバター生成ロジック（実際のプロダクトではAIで生成）
  const getAvatarStyle = (look: CloneLook) => {
    const styles: React.CSSProperties = {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "50%",
    };

    // 髪の色に応じて背景を変更
    if (look.hair?.includes("茶色")) {
      styles.background = "linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)";
    } else if (look.hair?.includes("金髪")) {
      styles.background = "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)";
    } else if (look.hair?.includes("ピンク")) {
      styles.background = "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)";
    }

    return styles;
  };

  const getMoodEmoji = (mood: string = "にっこり") => {
    const emojiMap: { [key: string]: string } = {
      "にっこり": "😊",
      "クール": "😎",
      "元気": "😄",
      "おっとり": "😌",
      "いたずらっ子": "😏"
    };
    return emojiMap[mood] || "😊";
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative flex items-center justify-center text-white font-bold ${textSizes[size]} shadow-lg`}
        style={getAvatarStyle(look)}
        animate={animated ? {
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0]
        } : undefined}
        transition={animated ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      >
        <span className="text-2xl">{getMoodEmoji(look?.mood)}</span>
        
        {/* アクセサリー表示 */}
        {look?.acc && (
          <motion.div
            className="absolute -top-1 -right-1 text-xs bg-white/80 rounded-full px-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {look?.acc?.includes("メガネ") ? "👓" : 
             look?.acc?.includes("帽子") ? "🎩" :
             look?.acc?.includes("イヤリング") ? "💎" : "✨"}
          </motion.div>
        )}
      </motion.div>

      {showDetails && (
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`font-semibold text-gray-700 ${textSizes[size]}`}>
            {look?.hair || "茶色のショート"}
          </div>
          <div className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {look?.eye || "優しい茶色"} • {look?.style || "カジュアル"}
          </div>
        </motion.div>
      )}
    </div>
  );
}