"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import CloneAvatar from "@/components/ui/CloneAvatar";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { Work } from "@/types";
import { dailyThemes } from "@/data/mockData";

export default function GeneratePage() {
  const router = useRouter();
  const { state, actions } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWork, setGeneratedWork] = useState<Work | null>(null);

  const todayThemeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyThemes.length;
  const todayTheme = dailyThemes[todayThemeIndex];

  const canGenerate = state.todaysProgress.qaCompleted > 0 || state.todaysProgress.minigameCompleted;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate mock work based on theme
    const newWork: Work = {
      workId: `work_${Date.now()}`,
      theme: todayTheme.theme,
      pairingId: `pair_${Date.now()}`,
      ...(todayTheme.theme === "漫才" ? {
        script: generateMockManzai(todayTheme.title)
      } : {
        lyrics: generateMockLyrics(todayTheme.title)
      }),
      ogMeta: {
        title: `${todayTheme.title} - ${todayTheme.theme}`,
        desc: `${state.user?.nickname}のクローンが生成したオリジナル${todayTheme.theme}`,
        image: `/api/og/${Date.now()}`
      },
      stats: {
        plays: 0,
        likes: 0,
        comments: 0,
        shares: 0
      },
      createdAt: new Date().toISOString()
    };

    setGeneratedWork(newWork);
    actions.generateWork(newWork);
    actions.addExperience(100);
    actions.awardBadge("クリエイター");
    
    setIsGenerating(false);
  };

  const generateMockManzai = (theme: string) => ({
    tsukami: `A「${theme}について話しましょう」 B「おっ、いいテーマですね！」`,
    tenkai: `A「実は昨日体験したんですよ...」 B「え、どんな？」 A「まさかの展開で...」 B「気になります！」`,
    ochi: `A「結局、${theme}って奥が深いんですよ」 B「確かに！...って、それオチですか？」 A「はい、すみません」`
  });

  const generateMockLyrics = (theme: string) => ({
    aMelody: [
      `${theme}の中で`,
      "君を思い出してる",
      "あの日の約束",
      "今も胸に響いて"
    ],
    chorus: [
      "時は過ぎても",
      "変わらない想い",
      "君への愛を",
      "歌い続けよう"
    ]
  });

  const handleShare = () => {
    if (navigator.share && generatedWork) {
      navigator.share({
        title: generatedWork.ogMeta.title,
        text: generatedWork.ogMeta.desc,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('リンクをクリップボードにコピーしました！');
    }
  };

  const handleLike = () => {
    if (generatedWork) {
      actions.likeWork(generatedWork.workId);
      setGeneratedWork(prev => prev ? {
        ...prev,
        stats: { ...prev.stats, likes: prev.stats.likes + 1 }
      } : null);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <LoadingAnimation 
          message="作品を生成中..." 
          type="creation"
        />
      </div>
    );
  }

  if (generatedWork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold gradient-text">
              作品が完成しました！
            </h1>
            <p className="text-gray-600">
              あなたのクローンが素晴らしい作品を創造しました
            </p>
          </motion.div>

          {/* Generated Work Display */}
          <AnimatedCard delay={0.3} glow>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {todayTheme.theme === "漫才" ? "🎭" : "🎵"}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {generatedWork.ogMeta.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(generatedWork.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
                <CloneAvatar look={state.clone?.look || {}} size="md" animated />
              </div>

              {/* Manzai Content */}
              {generatedWork.script && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2">【ツカミ】</h3>
                    <p className="text-gray-800">{generatedWork.script.tsukami}</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <h3 className="font-semibold text-primary-700 mb-2">【展開】</h3>
                    <p className="text-gray-800">{generatedWork.script.tenkai}</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-2xl">
                    <h3 className="font-semibold text-accent-700 mb-2">【オチ】</h3>
                    <p className="text-gray-800">{generatedWork.script.ochi}</p>
                  </div>
                </div>
              )}

              {/* Lyrics Content */}
              {generatedWork.lyrics && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-700 mb-2">【Aメロ】</h3>
                    {generatedWork.lyrics.aMelody.map((line, index) => (
                      <p key={index} className="text-gray-800">{line}</p>
                    ))}
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-2xl">
                    <h3 className="font-semibold text-secondary-700 mb-2">【サビ】</h3>
                    {generatedWork.lyrics.chorus.map((line, index) => (
                      <p key={index} className="text-gray-800">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                <Button
                  onClick={handleLike}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>❤️</span>
                  <span>{generatedWork.stats.likes}</span>
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>📤</span>
                  <span>共有</span>
                </Button>

                <Button
                  onClick={() => router.push('/works')}
                  variant="outline"
                  size="sm"
                >
                  作品一覧を見る
                </Button>
              </div>
            </div>
          </AnimatedCard>

          {/* Success Stats */}
          <AnimatedCard delay={0.5}>
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                クローンの成長
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl font-bold text-primary-600">+100</div>
                  <div className="text-sm text-gray-600">経験値</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-secondary-600">+1</div>
                  <div className="text-sm text-gray-600">作品数</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-accent-600">NEW</div>
                  <div className="text-sm text-gray-600">称号</div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Navigation */}
          <div className="text-center space-y-4">
            <Button
              onClick={() => router.push('/home')}
              variant="primary"
              size="lg"
            >
              ホームに戻る 🏠
            </Button>
            <p className="text-sm text-gray-500">
              素晴らしい作品をありがとうございます！
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
            <span>{todayTheme.theme === "漫才" ? "🎭" : "🎵"}</span>
            <span>作品生成</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            {todayTheme.theme}を生成
          </h1>
          <p className="text-gray-600">
            今日のテーマ: {todayTheme.title}
          </p>
        </motion.div>

        {/* Clone Preview */}
        <AnimatedCard delay={0.2} glow>
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              あなたのクローン
            </h2>
            <div className="flex justify-center">
              <CloneAvatar 
                look={state.clone?.look || {}} 
                size="lg" 
                showDetails 
                animated 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">レベル</div>
                <div className="text-lg font-bold text-primary-600">{state.clone?.level}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">経験値</div>
                <div className="text-lg font-bold text-secondary-600">{state.clone?.experience}</div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Generation Prerequisites */}
        <AnimatedCard delay={0.3}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              生成に必要な条件
            </h3>
            <div className="space-y-2">
              <div className={`flex items-center space-x-3 p-3 rounded-2xl ${
                state.todaysProgress.qaCompleted > 0 ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                  state.todaysProgress.qaCompleted > 0 ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {state.todaysProgress.qaCompleted > 0 ? '✓' : '○'}
                </div>
                <span className="text-gray-700">
                  Q&A回答 ({state.todaysProgress.qaCompleted}/3)
                </span>
              </div>
              
              <div className={`flex items-center space-x-3 p-3 rounded-2xl ${
                state.todaysProgress.minigameCompleted ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                  state.todaysProgress.minigameCompleted ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {state.todaysProgress.minigameCompleted ? '✓' : '○'}
                </div>
                <span className="text-gray-700">
                  ミニゲーム完了
                </span>
              </div>
            </div>

            {!canGenerate && (
              <div className="p-4 bg-yellow-50 rounded-2xl">
                <p className="text-yellow-700 text-sm">
                  💡 Q&Aかミニゲームを完了すると作品生成が可能になります
                </p>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Generate Button */}
        <div className="text-center space-y-6">
          <Button
            onClick={handleGenerate}
            variant="accent"
            size="lg"
            disabled={!canGenerate}
            className="disabled:opacity-50"
          >
            {todayTheme.theme}を生成する ✨
          </Button>
          
          {canGenerate && (
            <p className="text-sm text-gray-500">
              生成には約30秒かかります
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/home')}
            variant="outline"
          >
            ホームに戻る
          </Button>
        </div>

      </div>
    </div>
  );
}