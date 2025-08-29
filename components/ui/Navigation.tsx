"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useApp();

  const menuItems = [
    { path: "/home", label: "ホーム", icon: "🏠", description: "メインページ" },
    { path: "/onboarding", label: "セットアップ", icon: "⚙️", description: "クローンの設定" },
    { path: "/qa", label: "Q&A", icon: "❓", description: "質問に答える" },
    { path: "/minigame", label: "ミニゲーム", icon: "🎮", description: "楽しく学習" },
    { path: "/collaboration", label: "コラボ創作", icon: "🤝", description: "共同制作" },
    { path: "/theme-works", label: "作品ギャラリー", icon: "🎨", description: "みんなの作品" },
    { path: "/works", label: "マイ作品", icon: "📚", description: "あなたの作品" },
    { path: "/chat", label: "チャット", icon: "💬", description: "作品について語り合う" },
    { path: "/generate", label: "作品生成", icon: "✨", description: "新しい作品を作る" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    if (pathname === "/" || pathname === "/onboarding") {
      router.push("/");
    } else {
      router.push("/home");
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div
            onClick={handleLogoClick}
            className="cursor-pointer flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-white font-bold text-xl">Y</span>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs">✨</span>
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Yoriai
              </h1>
              <p className="text-xs text-gray-500 -mt-1">AI Clone Creator</p>
            </div>
          </motion.div>

          {/* Hamburger Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full"
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full mt-1"
                animate={{
                  opacity: isOpen ? 0 : 1,
                  x: isOpen ? -10 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full mt-1"
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 h-full w-80 z-50 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">👋</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {state.user?.nickname || "ゲスト"}さん
                    </h3>
                    <p className="text-sm text-gray-500">クローン作成者</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-gray-600">✕</span>
                </motion.button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200/50">
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-500">
                  クローンレベル: {state.clone?.level || 1}
                </div>
                <div className="text-sm text-gray-500">
                  経験値: {state.clone?.experience || 0}
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < (state.clone?.level || 1) ? "bg-yellow-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;