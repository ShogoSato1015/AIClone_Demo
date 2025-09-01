"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import CloneAvatar from "@/components/ui/CloneAvatar";
import { PersonaTag } from "@/types";
import { appearanceOptions } from "@/data/mockData";

export default function CharacterCustomizationPage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [nickname, setNickname] = useState(state.user?.nickname || "");
  const [anonymityLevel, setAnonymityLevel] = useState<"high" | "medium" | "low">(state.user?.anonymityLevel || "medium");
  const [selectedTags, setSelectedTags] = useState<PersonaTag[]>(
    state.clone?.personaSnapshot.scores.filter(s => s.value > 50).map(s => s.tag) || []
  );
  const [avatarLook, setAvatarLook] = useState(
    state.clone?.look || {
      hair: appearanceOptions.hair[0],
      eye: appearanceOptions.eye[0],
      acc: appearanceOptions.acc[0],
      mood: appearanceOptions.mood[0],
      style: appearanceOptions.style[0],
    }
  );
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const personaTags: PersonaTag[] = ["共感", "論理", "冒険", "保守", "ユーモア", "ロマン"];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedPhoto(result);
        
        // AI画像解析シミュレーション - 実際のAI分析を模擬
        setTimeout(() => {
          // 写真から推測される外見設定
          setAvatarLook({
            hair: appearanceOptions.hair[Math.floor(Math.random() * appearanceOptions.hair.length)],
            eye: appearanceOptions.eye[Math.floor(Math.random() * appearanceOptions.eye.length)],
            acc: appearanceOptions.acc[Math.floor(Math.random() * appearanceOptions.acc.length)],
            mood: "にっこり",
            style: "カジュアル",
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: PersonaTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    // 個性タグを更新
    selectedTags.forEach(tag => {
      actions.updatePersona(tag, 20);
    });
    
    // アバター外見を更新
    actions.updateCloneAppearance(avatarLook);
    
    // ユーザー情報更新
    if (nickname !== state.user?.nickname || anonymityLevel !== state.user?.anonymityLevel) {
      actions.setUser({
        ...state.user!,
        nickname: nickname,
        anonymityLevel: anonymityLevel
      });
    }
    
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">
            Aiconカスタマイズ ✨
          </h1>
          <p className="text-gray-600 text-lg">
            あなたのAiconをより個性的にカスタマイズしましょう
          </p>
        </motion.div>

        {/* Current Avatar Display */}
        <motion.div
          className="bg-gradient-to-br from-violet-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-violet-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-violet-800">現在のAicon</h2>
            <div className="flex justify-center">
              <CloneAvatar look={avatarLook} size="xl" showDetails />
            </div>
            <div className="text-lg font-semibold text-violet-700">
              {nickname || "名前未設定"}
            </div>
          </div>
        </motion.div>

        {/* Photo Upload Section */}
        <motion.div
          className="bg-gradient-to-br from-blue-100/90 to-cyan-100/90 backdrop-blur-sm border-2 border-blue-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 text-center">
              写真アップロード機能 📸
            </h2>
            <p className="text-center text-blue-700">
              あなたの写真をアップロードして、Aiconの外見に反映させましょう
            </p>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  {uploadedPhoto ? (
                    <img
                      src={uploadedPhoto}
                      alt="アップロード写真"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="text-4xl">📷</div>
                      <div className="text-blue-700 font-medium">写真をアップロード</div>
                      <div className="text-sm text-blue-600">クリックして選択</div>
                    </div>
                  )}
                </label>
              </div>
              
              {uploadedPhoto && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2"
                >
                  <div className="text-green-600 font-medium">✓ 写真が解析されました</div>
                  <div className="text-sm text-blue-600">
                    AIがあなたの写真を解析してAiconの外見を自動調整しました
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* User Info Section */}
        <motion.div
          className="bg-gradient-to-br from-emerald-100/90 to-teal-100/90 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 text-center">ユーザー情報</h2>
            
            {/* Nickname */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-700">ニックネーム</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="あなたの名前を入力..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-lg bg-white/70"
                maxLength={10}
              />
            </div>

            {/* Anonymity Level */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-emerald-700">作品公開時の匿名レベル</label>
              <div className="space-y-2">
                {[
                  { level: "high" as const, title: "高匿名", desc: "完全匿名で公開", icon: "🕶️" },
                  { level: "medium" as const, title: "中匿名", desc: "ニックネームのみ表示", icon: "😎" },
                  { level: "low" as const, title: "低匿名", desc: "詳細プロフィール表示", icon: "😊" }
                ].map((option) => (
                  <motion.div
                    key={option.level}
                    onClick={() => setAnonymityLevel(option.level)}
                    className={`cursor-pointer transition-all rounded-2xl p-3 border-2 ${[
                      anonymityLevel === option.level 
                        ? 'bg-emerald-200/80 border-emerald-400 ring-2 ring-emerald-300' 
                        : 'bg-white/80 border-emerald-200 hover:border-emerald-300'
                    ]}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{option.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-emerald-800">{option.title}</h4>
                        <p className="text-sm text-emerald-600">{option.desc}</p>
                      </div>
                      {anonymityLevel === option.level && (
                        <div className="text-emerald-600 text-lg">✓</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance Customization */}
        <motion.div
          className="bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm border-2 border-pink-200/50 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-pink-800 text-center">外見カスタマイズ</h2>
            
            <div className="space-y-4">
              {Object.entries(appearanceOptions).map(([key, options]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-pink-700 capitalize">
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
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-white text-pink-700 hover:bg-pink-50 border border-pink-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Personality Tags */}
        <motion.div
          className="bg-gradient-to-br from-orange-100/90 to-yellow-100/90 backdrop-blur-sm border-2 border-orange-200/50 rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-800 text-center">個性タグ</h3>
            <p className="text-center text-orange-700 text-sm">
              あなたの個性を表すタグを2〜3個選んでください
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {personaTags.map((tag) => (
                <motion.div
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`cursor-pointer transition-all text-center rounded-2xl p-3 border-2 ${
                    selectedTags.includes(tag)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-orange-700 hover:bg-orange-50 border-orange-200'
                  } ${selectedTags.length >= 3 && !selectedTags.includes(tag) ? 'opacity-50' : ''}`}
                  whileHover={{ scale: selectedTags.length >= 3 && !selectedTags.includes(tag) ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-y-1">
                    <div className="text-2xl">
                      {tag === "共感" ? "💝" :
                       tag === "論理" ? "🧠" :
                       tag === "冒険" ? "🚀" :
                       tag === "保守" ? "🛡️" :
                       tag === "ユーモア" ? "😂" : "💕"}
                    </div>
                    <div className="font-semibold">{tag}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-sm text-orange-600">
              {selectedTags.length}/3 個選択中
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleSave}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-xl px-12 py-4"
            disabled={!nickname.trim() || selectedTags.length < 2}
          >
            Aiconを保存 ✨
          </Button>
          <p className="text-sm text-gray-600">
            設定を保存してホームに戻ります
          </p>
          
          <Button
            onClick={() => router.push('/home')}
            variant="outline"
            size="lg"
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            ホームに戻る 🏠
          </Button>
        </motion.div>
      </div>
    </div>
  );
}