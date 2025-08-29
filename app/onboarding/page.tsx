"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import ProgressBar from "@/components/ui/ProgressBar";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { PersonaTag } from "@/types";
import { appearanceOptions } from "@/data/mockData";

type OnboardingStep = "welcome" | "nickname" | "anonymity" | "preferences" | "avatar" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [nickname, setNickname] = useState("");
  const [anonymityLevel, setAnonymityLevel] = useState<"high" | "medium" | "low">("medium");
  const [selectedTags, setSelectedTags] = useState<PersonaTag[]>([]);
  const [avatarLook, setAvatarLook] = useState({
    hair: appearanceOptions.hair[0],
    eye: appearanceOptions.eye[0],
    acc: appearanceOptions.acc[0],
    mood: appearanceOptions.mood[0],
    style: appearanceOptions.style[0],
  });

  const steps: OnboardingStep[] = ["welcome", "nickname", "anonymity", "preferences", "avatar", "complete"];
  const currentStepIndex = steps.indexOf(currentStep);

  const personaTags: PersonaTag[] = ["共感", "論理", "冒険", "保守", "ユーモア", "ロマン"];

  const handleNext = () => {
    if (currentStep === "complete") {
      // Initialize persona with selected preferences
      selectedTags.forEach(tag => {
        actions.updatePersona(tag, 20); // Give boost to selected preferences
      });
      
      // Update clone appearance
      actions.updateCloneAppearance(avatarLook);
      
      actions.addExperience(100); // Initial experience
      actions.awardBadge("新人コメディアン");
      
      router.push("/home");
      return;
    }

    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStep(steps[nextIndex]);
  };

  const handleBack = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex]);
  };

  const handleTagToggle = (tag: PersonaTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "nickname": return nickname.trim().length > 0;
      case "preferences": return selectedTags.length >= 2;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Progress Bar */}
        <ProgressBar
          current={currentStepIndex + 1}
          total={steps.length}
          color="primary"
          label="セットアップ進捗"
        />

        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl font-bold gradient-text">
              AIクローンデモへ<br />ようこそ! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              30秒の簡単セットアップで、あなた専用のAIクローンが誕生します
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-gradient-to-br from-blue-100/90 to-cyan-100/90 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ❓
                </motion.div>
                <h3 className="font-bold text-blue-800 text-lg">質問に回答</h3>
                <p className="text-blue-700">あなたの個性を教えて</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-purple-100/90 to-violet-100/90 backdrop-blur-sm border-2 border-purple-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎮
                </motion.div>
                <h3 className="font-bold text-purple-800 text-lg">ゲームプレイ</h3>
                <p className="text-purple-700">楽しみながら学習</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm border-2 border-pink-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎭
                </motion.div>
                <h3 className="font-bold text-pink-800 text-lg">作品創作</h3>
                <p className="text-pink-700">オリジナル作品が完成</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Nickname Step */}
        {currentStep === "nickname" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                あなたのニックネームは？
              </h2>
              <p className="text-gray-600">
                クローンがあなたを呼ぶ時の名前です
              </p>
            </div>
            
            <motion.div 
              className="bg-gradient-to-br from-emerald-100/90 to-teal-100/90 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-4">
                <label className="block text-sm font-medium text-emerald-800">
                  ニックネーム
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="例：たろう、さくら、など"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-lg bg-white/70"
                  maxLength={10}
                />
                <p className="text-xs text-emerald-600">
                  10文字以内で入力してください
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Anonymity Step */}
        {currentStep === "anonymity" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                匿名レベルの設定
              </h2>
              <p className="text-gray-600">
                作品を共有する時の匿名性を選択してください
              </p>
            </div>

            <div className="space-y-4">
              {[
                { level: "high" as const, title: "高匿名", desc: "完全匿名で共有", icon: "🕶️" },
                { level: "medium" as const, title: "中匿名", desc: "ニックネームのみ表示", icon: "😎" },
                { level: "low" as const, title: "低匿名", desc: "詳細プロフィール表示", icon: "😊" }
              ].map((option) => (
                <motion.div
                  key={option.level}
                  onClick={() => setAnonymityLevel(option.level)}
                  className={`cursor-pointer transition-all rounded-3xl p-4 border-2 shadow-lg hover:shadow-xl ${
                    anonymityLevel === option.level 
                      ? 'bg-gradient-to-br from-indigo-100/90 to-purple-100/90 border-indigo-300 ring-2 ring-indigo-400' 
                      : 'bg-gradient-to-br from-gray-100/90 to-slate-100/90 border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: option.level === 'high' ? 0.1 : option.level === 'medium' ? 0.2 : 0.3 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{option.title}</h3>
                      <p className="text-gray-600">{option.desc}</p>
                    </div>
                    {anonymityLevel === option.level && (
                      <div className="text-indigo-600 text-xl">✓</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preferences Step */}
        {currentStep === "preferences" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                あなたの個性タグ
              </h2>
              <p className="text-gray-600">
                当てはまるものを2〜3個選んでください
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {personaTags.map((tag) => (
                <motion.div
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`cursor-pointer transition-all text-center rounded-3xl p-4 border-2 shadow-lg hover:shadow-xl ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-br from-orange-100/90 to-yellow-100/90 border-orange-300 ring-2 ring-orange-400'
                      : 'bg-gradient-to-br from-gray-100/90 to-slate-100/90 border-gray-200 hover:border-gray-300'
                  } ${selectedTags.length >= 3 && !selectedTags.includes(tag) ? 'opacity-50' : ''}`}
                  whileHover={{ scale: selectedTags.length >= 3 && !selectedTags.includes(tag) ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: personaTags.indexOf(tag) * 0.1 }}
                >
                  <div className="space-y-2">
                    <div className="text-3xl">
                      {tag === "共感" ? "💝" :
                       tag === "論理" ? "🧠" :
                       tag === "冒険" ? "🚀" :
                       tag === "保守" ? "🛡️" :
                       tag === "ユーモア" ? "😂" : "💕"}
                    </div>
                    <h3 className="font-semibold text-gray-800">{tag}</h3>
                    {selectedTags.includes(tag) && (
                      <div className="text-orange-600 font-bold">✓ 選択中</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-sm text-gray-500">
              {selectedTags.length}/3 個選択中
            </p>
          </motion.div>
        )}

        {/* Avatar Step */}
        {currentStep === "avatar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                クローンの外見
              </h2>
              <p className="text-gray-600">
                あなたのクローンの初期外見を設定してください
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <CloneAvatar look={avatarLook} size="xl" showDetails />
            </div>

            <div className="space-y-4">
              {Object.entries(appearanceOptions).map(([key, options]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key === 'hair' ? '髪型' : 
                     key === 'eye' ? '目' : 
                     key === 'acc' ? 'アクセサリー' : 
                     key === 'mood' ? '表情' : 'スタイル'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setAvatarLook({...avatarLook, [key]: option})}
                        className={`px-3 py-2 rounded-2xl text-sm transition-all ${
                          avatarLook[key as keyof typeof avatarLook] === option
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold gradient-text">
              セットアップ完了！
            </h2>
            <p className="text-xl text-gray-600">
              {nickname}さんのAIクローンが誕生しました
            </p>

            <motion.div 
              className="bg-gradient-to-br from-violet-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-violet-200/50 rounded-3xl p-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <CloneAvatar look={avatarLook} size="lg" showDetails />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-violet-800 text-center text-xl">あなたの個性</h3>
                <div className="flex justify-center flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-violet-200/80 text-violet-800 rounded-full text-sm font-medium border border-violet-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <p className="text-gray-600">
              さあ、今日のQ&Aとミニゲームで<br />
              クローンを成長させましょう！
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStepIndex === 0}
            className={currentStepIndex === 0 ? "invisible" : ""}
          >
            戻る
          </Button>
          
          <Button
            onClick={handleNext}
            variant="primary"
            disabled={!canProceed()}
          >
            {currentStep === "complete" ? "体験を始める 🚀" : "次へ"}
          </Button>
        </div>
      </div>
    </div>
  );
}